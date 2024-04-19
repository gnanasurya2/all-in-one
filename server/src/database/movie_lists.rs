//! `SeaORM` Entity. Generated by sea-orm-codegen 0.12.3

use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "movie_lists")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub title: String,
    pub poster: Option<String>,
    pub imdb_id: String,
    pub list_id: i32,
    pub updated_at: Option<DateTimeUtc>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::lists::Entity",
        from = "Column::ListId",
        to = "super::lists::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    Lists,
}

impl Related<super::lists::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Lists.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}