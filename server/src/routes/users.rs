use axum::{http::StatusCode, Extension, Json};
use bcrypt::HashParts;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, IntoActiveModel, QueryFilter,
    Set,
};
use serde::{Deserialize, Serialize};

use crate::database::prelude::Users;
use crate::database::users;
use crate::utils::app_error::AppError;
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
) -> Result<Json<ResponseUser>, AppError> {
    let hashed_password = hash_password(create_user_request.password)?;

    let salt = hashed_password.get_salt();

    let new_users = users::ActiveModel {
        username: Set(create_user_request.username),
        password_hash: Set(hashed_password.format_for_version(bcrypt::Version::TwoB)),
        password_salt: Set(salt),
        token: Set(None),
        ..Default::default()
    }
    .save(&database)
    .await
    .map_err(|_| {
        AppError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            "error while creating user",
        )
    })?;

    let jwt = create_jwt(new_users.id.clone().unwrap())?;

    Ok(Json(ResponseUser {
        username: new_users.username.unwrap(),
        id: new_users.id.unwrap(),
        token: jwt,
    }))
}

pub async fn login(
    Extension(database): Extension<DatabaseConnection>,
    Json(request_user): Json<RequestUser>,
) -> Result<Json<ResponseUser>, AppError> {
    let db_user = Users::find()
        .filter(users::Column::Username.eq(request_user.username))
        .one(&database)
        .await
        .map_err(|_| {
            AppError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "error while finding the user",
            )
        })?;

    if let Some(db_user) = db_user {
        if !verify_password(request_user.password, &db_user.password_hash)? {
            return Err(AppError::new(
                StatusCode::UNAUTHORIZED,
                "invalid username/password",
            ));
        }

        let mut user = db_user.into_active_model();
        user.token = Set(None);

        let saved_user = user.save(&database).await.map_err(|_| {
            AppError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "error while saving the video",
            )
        })?;

        let token = create_jwt(saved_user.id.clone().unwrap())?;

        Ok(Json(ResponseUser {
            username: saved_user.username.unwrap(),
            token,
            id: saved_user.id.unwrap(),
        }))
    } else {
        return Err(AppError::new(
            StatusCode::NOT_FOUND,
            "invalid username/password",
        ));
    }
}

pub async fn logout() -> Result<(), AppError> {
    //TODO:implement a blacklist for token to avoid using the token when the user is logged out.
    Ok(())
}

fn hash_password(password: String) -> Result<HashParts, AppError> {
    bcrypt::hash_with_result(password, 8)
        .map_err(|_| AppError::new(StatusCode::INTERNAL_SERVER_ERROR, "error while hashing"))
}

fn verify_password(password: String, hash: &str) -> Result<bool, AppError> {
    bcrypt::verify(password, hash).map_err(|_| {
        AppError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            "error while validating the password",
        )
    })
}
