extern crate dotenv;

use dotenv::dotenv;
use server::run;
use std::env;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL is not found in enviroment");

    run(&database_url).await
}
