pub use sea_orm_migration::prelude::*;

mod m20220101_000001_create_table;
mod m20231015_082108_add_token_to_users;
mod m20231021_103237_create_movie_table;
mod m20231021_190712_update_movie_table;
mod m20231022_120942_add_movie_title_to_movie_table;
mod m20231231_193712_create_lists_table;
mod m20240101_084417_foreign_keys_tables;
mod m20240106_071010_updated_at_timestamp;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_create_table::Migration),
            Box::new(m20231015_082108_add_token_to_users::Migration),
            Box::new(m20231021_103237_create_movie_table::Migration),
            Box::new(m20231021_190712_update_movie_table::Migration),
            Box::new(m20231022_120942_add_movie_title_to_movie_table::Migration),
            Box::new(m20231231_193712_create_lists_table::Migration),
            Box::new(m20240101_084417_foreign_keys_tables::Migration),
            Box::new(m20240106_071010_updated_at_timestamp::Migration),
        ]
    }
}
