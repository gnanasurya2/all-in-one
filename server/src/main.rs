extern crate dotenv;

use server::run;
use dotenv::dotenv;

#[tokio::main]
async fn main() {
    dotenv().ok();
    run().await
}
