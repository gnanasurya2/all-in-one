use axum::{body::Body, http::Request, middleware::Next, response::Response};
use axum_extra::{
    headers::{authorization::Bearer, Authorization},
    TypedHeader,
};

use crate::utils::{app_error::AppError, jwt::decode_token};

#[derive(Clone)]
pub struct AuthData {
    pub id: i32,
}

pub async fn guard(
    TypedHeader(token): TypedHeader<Authorization<Bearer>>,
    mut request: Request<Body>,
    next: Next,
) -> Result<Response, AppError> {
    println!("request {:?}", request.uri());
    let token = token.token().to_owned();
    let token_data = decode_token(&token)?;

    request.extensions_mut().insert(AuthData {
        id: token_data.cust_id,
    });

    Ok(next.run(request).await)
}
