use sea_orm_migration::prelude::*;

use crate::{
    m20220101_000001_create_table::Users,
    m20231021_103237_create_movie_table::Movies,
    m20231231_193712_create_lists_table::{Lists, MovieLists},
};

#[derive(DeriveMigrationName)]
pub struct Migration;

// Ref fk_movies_user_id: movies.user_id - users.id
#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_index(
                sea_query::Index::create()
                    .name("idx_lists_user_id")
                    .table(Lists::Table)
                    .col(Lists::UserId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                sea_query::Index::create()
                    .name("idx_movies_list_id")
                    .table(MovieLists::Table)
                    .col(MovieLists::ListId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                sea_query::Index::create()
                    .name("idx_movies_user_id")
                    .table(Movies::Table)
                    .col(Movies::UserId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                sea_query::ForeignKey::create()
                    .name("fk_movies_user_id")
                    .from(Movies::Table, Movies::UserId)
                    .to(Users::Table, Users::Id)
                    .on_update(ForeignKeyAction::Cascade)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                sea_query::ForeignKey::create()
                    .name("fk_movie_lists_list")
                    .from(MovieLists::Table, MovieLists::ListId)
                    .to(Lists::Table, Lists::Id)
                    .on_update(ForeignKeyAction::Cascade)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                sea_query::ForeignKey::create()
                    .name("fk_lists_users")
                    .from(Lists::Table, Lists::UserId)
                    .to(Users::Table, Users::Id)
                    .on_update(ForeignKeyAction::Cascade)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_foreign_key(
                ForeignKey::drop()
                    .name("fk_lists_users")
                    .table(Lists::Table)
                    .to_owned(),
            )
            .await?;

        manager
            .drop_foreign_key(
                ForeignKey::drop()
                    .name("fk_movie_lists_list")
                    .table(MovieLists::Table)
                    .to_owned(),
            )
            .await?;

        manager
            .drop_foreign_key(
                sea_query::ForeignKey::drop()
                    .name("fk_movies_user_id")
                    .table(Movies::Table)
                    .to_owned(),
            )
            .await?;

        manager
            .drop_index(
                sea_query::Index::drop()
                    .name("idx_movies_user_id")
                    .table(Movies::Table)
                    .to_owned(),
            )
            .await?;

        manager
            .drop_index(
                sea_query::Index::drop()
                    .name("idx_movies_list_id")
                    .table(MovieLists::Table)
                    .to_owned(),
            )
            .await?;

        manager
            .drop_index(
                sea_query::Index::drop()
                    .name("idx_lists_user_id")
                    .table(Lists::Table)
                    .to_owned(),
            )
            .await
    }
}
