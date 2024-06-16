use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
enum Movies {
    Table,
    Type,
    Season,
    Episode,
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        manager
            .alter_table(
                Table::alter()
                    .table(Movies::Table)
                    .add_column(
                        ColumnDef::new(Movies::Type)
                            .string()
                            .default("movie".to_owned()),
                    )
                    .add_column(ColumnDef::new(Movies::Season).integer().default(0))
                    .add_column(ColumnDef::new(Movies::Episode).integer().default(0))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Movies::Table)
                    .drop_column(Movies::Type)
                    .drop_column(Movies::Season)
                    .drop_column(Movies::Episode)
                    .to_owned(),
            )
            .await
    }
}
