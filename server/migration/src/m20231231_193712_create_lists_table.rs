use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
pub enum Lists {
    Table,
    Id,
    Title,
    Description,
    UserId,
}

#[derive(DeriveIden)]
pub enum MovieLists {
    Table,
    Id,
    ListId,
    Title,
    Poster,
    ImdbId,
}
#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Lists::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Lists::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(Lists::Title)
                            .string()
                            .string_len(50)
                            .not_null(),
                    )
                    .col(ColumnDef::new(Lists::Description).string().string_len(200))
                    .col(ColumnDef::new(Lists::UserId).integer().not_null())
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(MovieLists::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(MovieLists::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(MovieLists::Title)
                            .string()
                            .string_len(200)
                            .not_null(),
                    )
                    .col(ColumnDef::new(MovieLists::Poster).string().string_len(200))
                    .col(
                        ColumnDef::new(MovieLists::ImdbId)
                            .string()
                            .string_len(16)
                            .not_null(),
                    )
                    .col(ColumnDef::new(MovieLists::ListId).integer().not_null())
                    .to_owned(),
            )
            .await?;
        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Lists::Table).to_owned())
            .await?;

        manager
            .drop_table(Table::drop().table(MovieLists::Table).to_owned())
            .await?;

        Ok(())
    }
}
