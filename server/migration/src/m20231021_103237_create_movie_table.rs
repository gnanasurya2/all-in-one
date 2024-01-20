use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
pub enum Movies {
    Table,
    Id,
    ImdbId,
    Rating,
    UserId,
    Liked,
    Watched,
    WatchedDate,
    WatchList,
    CreatedAt,
    UpdatedAt,
}

// Table Movies {
//   id integer [primary key]
//   name varchar
//   imdbId varchar
//   rating float
//   userId integer
//   liked boolean
//   watchlist boolean
// }

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Movies::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Movies::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(Movies::ImdbId)
                            .string()
                            .string_len(16)
                            .not_null(),
                    )
                    .col(ColumnDef::new(Movies::Liked).boolean().default(false))
                    .col(ColumnDef::new(Movies::Watched).boolean().default(false))
                    .col(ColumnDef::new(Movies::WatchList).boolean().default(false))
                    .col(ColumnDef::new(Movies::UserId).integer().not_null())
                    .col(ColumnDef::new(Movies::Rating).float().not_null())
                    .col(
                        ColumnDef::new(Movies::CreatedAt)
                            .timestamp()
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        ColumnDef::new(Movies::UpdatedAt)
                            .timestamp()
                            .default(Expr::current_timestamp()),
                    )
                    .col(ColumnDef::new(Movies::WatchedDate).date_time())
                    .to_owned(),
            )
            .await?;
        manager
            .create_index(
                Index::create()
                    .name("idx_movies_users_id")
                    .table(Movies::Table)
                    .col(Movies::UserId)
                    .to_owned(),
            )
            .await?;
        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Movies::Table).to_owned())
            .await
    }
}
