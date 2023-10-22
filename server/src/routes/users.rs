use axum::{http::StatusCode, Extension, Json};
use bcrypt::HashParts;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, IntoActiveModel, QueryFilter,
    Set,
};
use serde::{Deserialize, Serialize};

use crate::database::users::Entity as Users;
use crate::database::users::{self, Model};
use crate::utils::jwt::create_jwt;

#[derive(Deserialize, Serialize, Debug)]
pub struct RequestUser {
    username: String,
    password: String,
}

#[derive(Serialize, Deserialize)]
pub struct ResponseUser {
    username: String,
    id: i32,
    token: String,
}

pub async fn create_users(
    Extension(database): Extension<DatabaseConnection>,
    Json(create_user_request): Json<RequestUser>,
) -> Result<Json<ResponseUser>, StatusCode> {
    let jwt = create_jwt()?;

    let hashed_password = hash_password(create_user_request.password)?;

    let salt = hashed_password.get_salt();

    let new_users = users::ActiveModel {
        username: Set(create_user_request.username),
        password_hash: Set(hashed_password.format_for_version(bcrypt::Version::TwoB)),
        password_salt: Set(salt),
        token: Set(Some(jwt)),
        ..Default::default()
    }
    .save(&database)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(ResponseUser {
        username: new_users.username.unwrap(),
        id: new_users.id.unwrap(),
        token: new_users.token.unwrap().unwrap(),
    }))
}

pub async fn login(
    Extension(database): Extension<DatabaseConnection>,
    Json(request_user): Json<RequestUser>,
) -> Result<Json<ResponseUser>, StatusCode> {
    let db_user = Users::find()
        .filter(users::Column::Username.eq(request_user.username))
        .one(&database)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if let Some(db_user) = db_user {
        if !verify_password(request_user.password, &db_user.password_hash)? {
            return Err(StatusCode::UNAUTHORIZED);
        }

        let new_jwt = create_jwt()?;

        let mut user = db_user.into_active_model();
        user.token = Set(Some(new_jwt));

        let saved_user = user
            .save(&database)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        Ok(Json(ResponseUser {
            username: saved_user.username.unwrap(),
            token: saved_user.token.unwrap().unwrap(),
            id: saved_user.id.unwrap(),
        }))
    } else {
        return Err(StatusCode::NOT_FOUND);
    }
}

pub async fn logout(
    Extension(database): Extension<DatabaseConnection>,
    Extension(user): Extension<Model>,
) -> Result<(), StatusCode> {
    let mut active_user = user.into_active_model();

    active_user.token = Set(None);

    active_user
        .save(&database)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(())
}

fn hash_password(password: String) -> Result<HashParts, StatusCode> {
    bcrypt::hash_with_result(password, 8).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

fn verify_password(password: String, hash: &str) -> Result<bool, StatusCode> {
    bcrypt::verify(password, hash).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}
