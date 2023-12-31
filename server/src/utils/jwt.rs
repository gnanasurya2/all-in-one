use axum::http::StatusCode;
use chrono::{Duration, Utc};
use dotenvy_macro::dotenv;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

use super::app_error::AppError;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    exp: usize,
    iat: usize,
    pub cust_id: i32,
}

pub fn create_jwt(cust_id: i32) -> Result<String, AppError> {
    let mut now = Utc::now();
    let iat = now.timestamp() as usize;
    let expires_in = Duration::days(1);

    now += expires_in;

    let exp = now.timestamp() as usize;

    let claim = Claims { iat, exp, cust_id };
    let secret: &'static str = dotenv!("JWT_SECRET");

    let key = EncodingKey::from_secret(secret.as_bytes());

    encode(&Header::default(), &claim, &key).map_err(|_| {
        AppError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            "error while encoding jwt",
        )
    })
}

pub fn decode_token(token: &str) -> Result<Claims, AppError> {
    let secret: &'static str = dotenv!("JWT_SECRET");

    let key = DecodingKey::from_secret(secret.as_bytes());

    let token_data = decode::<Claims>(
        token,
        &key,
        &Validation::new(jsonwebtoken::Algorithm::HS256),
    )
    .map_err(|error| match error.kind() {
        jsonwebtoken::errors::ErrorKind::ExpiredSignature => {
            AppError::new(StatusCode::UNAUTHORIZED, "expired signature")
        }
        jsonwebtoken::errors::ErrorKind::InvalidToken => {
            AppError::new(StatusCode::UNAUTHORIZED, "Invalid token")
        }
        jsonwebtoken::errors::ErrorKind::InvalidSignature => {
            AppError::new(StatusCode::UNAUTHORIZED, "invalid signature")
        }
        error => {
            println!("{:?}", error);
            AppError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "error while decoding the jwt token",
            )
        }
    })?;

    Ok(token_data.claims)
}
