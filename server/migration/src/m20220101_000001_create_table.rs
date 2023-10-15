use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[derive(DeriveIden)]
enum Users {
    Table,
    Id,
    Username,
    Email,
    PasswordHash,
    PasswordSalt,
    CreatedAt,
}

// CREATE TABLE Users (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     Username VARCHAR(50),
//     Email VARCHAR(100),
//     PasswordHash VARCHAR(255) NOT NULL,
//     PasswordSalt VARCHAR(32) NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// );

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Users::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Users::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(Users::Username)
                            .string()
                            .string_len(50)
                            .not_null(),
                    )
                    .col(ColumnDef::new(Users::Email).string().string_len(100))
                    .col(
                        ColumnDef::new(Users::PasswordHash)
                            .string()
                            .string_len(255)
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(Users::PasswordSalt)
                            .string()
                            .string_len(32)
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(Users::CreatedAt)
                            .timestamp()
                            .default(SimpleExpr::Keyword(Keyword::CurrentTimestamp)),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Users::Table).to_owned())
            .await
    }
}
