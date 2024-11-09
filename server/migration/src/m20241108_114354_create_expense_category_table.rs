use sea_orm::ActiveEnum;
use sea_orm_migration::prelude::*;

use crate::m20220101_000001_create_table::Users;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
enum Categories {
    Table,
    Id,
    Name,
}

#[derive(DeriveIden)]
enum Expense {
    Table,
    Id,
    UserId,
    Type,
    Name,
    Amount,
    CategoryId,
    CreatedAt,
    UpdatedAt,
}

#[derive(Debug, Clone, PartialEq, sea_orm::EnumIter, sea_orm::DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "ExpenseType")]
pub enum ExpenseType {
    #[sea_orm(string_value = "Income")]
    Income,
    #[sea_orm(string_value = "Expense")]
    Expense,
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Categories::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Categories::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Categories::Name).string().not_null())
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(Expense::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Expense::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Expense::CategoryId).integer().not_null())
                    .col(ColumnDef::new(Expense::Name).string().null())
                    .col(ColumnDef::new(Expense::UserId).integer().not_null())
                    .col(ColumnDef::new(Expense::Amount).float().not_null())
                    .col(
                        ColumnDef::new(Expense::Type)
                            .string()
                            .not_null()
                            .default(ExpenseType::Income)
                            .extra("CHECK (type IN ('Income', 'Expense'))"),
                    )
                    .col(
                        ColumnDef::new(Expense::CreatedAt)
                            .timestamp()
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        ColumnDef::new(Expense::UpdatedAt)
                            .timestamp()
                            .default(Expr::current_timestamp()),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                sea_query::ForeignKey::create()
                    .name("fk_expense_category_id")
                    .from(Expense::Table, Expense::CategoryId)
                    .to(Categories::Table, Categories::Id)
                    .on_update(ForeignKeyAction::Cascade)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                sea_query::ForeignKey::create()
                    .name("fk_expense_user_id")
                    .from(Expense::Table, Expense::UserId)
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
                    .name("fk_expense_category_id")
                    .table(Expense::Table)
                    .to_owned(),
            )
            .await?;

        manager
            .drop_index(
                sea_query::Index::drop()
                    .name("fk_expense_category_id")
                    .table(Expense::Table)
                    .to_owned(),
            )
            .await?;

        manager
            .drop_foreign_key(
                ForeignKey::drop()
                    .name("fk_expense_user_id")
                    .table(Expense::Table)
                    .to_owned(),
            )
            .await?;

        manager
            .drop_index(
                sea_query::Index::drop()
                    .name("fk_expense_user_id")
                    .table(Expense::Table)
                    .to_owned(),
            )
            .await?;

        manager
            .drop_table(Table::drop().table(Categories::Table).to_owned())
            .await?;

        manager
            .drop_table(Table::drop().table(Expense::Table).to_owned())
            .await
    }
}
