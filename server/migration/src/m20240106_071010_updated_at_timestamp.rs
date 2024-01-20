use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
pub enum Lists {
    Table,
    UpdatedAt,
}

#[derive(DeriveIden)]
pub enum MovieLists {
    Table,
    UpdatedAt,
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Lists::Table)
                    .add_column(
                        ColumnDef::new(Lists::UpdatedAt)
                            .timestamp()
                            .default(Expr::current_timestamp()),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .alter_table(
                Table::alter()
                    .table(MovieLists::Table)
                    .add_column(
                        ColumnDef::new(MovieLists::UpdatedAt)
                            .timestamp()
                            .default(Expr::current_timestamp()),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Lists::Table)
                    .drop_column(Lists::UpdatedAt)
                    .to_owned(),
            )
            .await?;

        manager
            .alter_table(
                Table::alter()
                    .table(MovieLists::Table)
                    .drop_column(MovieLists::UpdatedAt)
                    .to_owned(),
            )
            .await
    }
}
