use sea_orm_migration::prelude::*;

use crate::m20231231_193712_create_lists_table::MovieLists;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_index(
                Index::create()
                    .name("unique_imdb_list_id")
                    .table(MovieLists::Table)
                    .col(MovieLists::ImdbId)
                    .col(MovieLists::ListId)
                    .unique()
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_index(
                Index::drop()
                    .name("unique_imdb_list_id")
                    .table(MovieLists::Table)
                    .to_owned(),
            )
            .await
    }
}
