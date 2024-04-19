extern crate dotenv;

use dotenv::dotenv;
use log::info;
use server::run;
use std::env;

#[tokio::main]
async fn main() {
    dotenv().ok();

    env_logger::init();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL is not found in enviroment");

    info!("application starting !!!");

    run(&database_url).await
}
