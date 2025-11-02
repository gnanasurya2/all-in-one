mod database;
mod routes;
mod scheduler;
mod services;
mod utils;

use std::{env, sync::Arc};

use bk_tree::{metrics::Levenshtein, BKTree};
use log::info;
use routes::create_routes;
use s3::creds::time::Instant;
use scheduler::backup_scheduler;
use sea_orm::Database;
use tokio::net::TcpListener;

use crate::services::r2::R2Store;
use migration::{Migrator, MigratorTrait};

#[derive(Clone)]
struct AppState {
    fst_set: Arc<fst::Set<Vec<u8>>>,
    bk_tree: Arc<BKTree<String, Levenshtein>>,
}

pub async fn run(database_url: &str) {
    info!("database url {}", database_url);
    let database = Database::connect(database_url).await.unwrap();

    Migrator::up(&database, None).await.unwrap();

    let access_key_id = env::var("R2_ACCESS_KEY_ID").unwrap();
    let secret_key_key = env::var("R2_SECRET_ACCESS_KEY").unwrap();
    let account_id = env::var("R2_ACCOUNT_ID").unwrap();
    let bucket_name = env::var("R2_BUCKET_NAME").unwrap();

    let r2_store = R2Store::new(access_key_id, secret_key_key, account_id, bucket_name);
    let _ = backup_scheduler::backup_scheduler(&r2_store).await;

    let start = Instant::now();
    let mut words: Vec<String> = std::fs::read_to_string("data_directory/words.txt")
        .expect("Failed to read words file")
        .lines()
        .map(|s| s.trim().to_lowercase())
        .filter(|s| !s.is_empty())
        .collect();
    info!("Read {} words in {:?}", words.len(), start.elapsed());

    words.sort();
    words.dedup();
    info!(
        "Sorted and deduplicated words, total count: {}",
        words.len()
    );

    let fst_set = Arc::new(
        fst::Set::from_iter(words.iter().map(|word| word.as_str()))
            .expect("Failed to create FST set"),
    );
    info!(
        "Created FST set with {} words in {:?}",
        fst_set.len(),
        start.elapsed()
    );
    let mut bk_tree: BKTree<String> = bk_tree::BKTree::new(Levenshtein);

    for word in &words {
        bk_tree.add(word.clone());
    }
    info!("Created BK-Tree in {:?}", start.elapsed());

    let bk_tree = Arc::new(bk_tree);
    let state = AppState { fst_set, bk_tree };

    let app = create_routes(database, r2_store, state);

    let listener = TcpListener::bind("0.0.0.0:1540").await.unwrap();

    axum::serve(listener, app.into_make_service())
        .await
        .unwrap()
}
