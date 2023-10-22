use sea_orm::sea_query::Table;
use sea_orm_migration::prelude::*;
#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(Iden)]
enum Movies {
    Table,
    Poster,
    Year,
}

// Table Movies {
//   id integer [primary key]
//   name varchar
//   imdbId varchar
//   rating float
//   userId integer
//   liked boolean
//   watchlist boolean
//   poster string
//   year number
// }
#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Movies::Table)
                    .add_column(ColumnDef::new(Movies::Poster).string().string_len(200))
                    .add_column(ColumnDef::new(Movies::Year).integer().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Movies::Table)
                    .drop_column(Movies::Poster)
                    .drop_column(Movies::Year)
                    .to_owned(),
            )
            .await
    }
}
