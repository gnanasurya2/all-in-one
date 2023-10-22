use axum::{response::IntoResponse, Json};
use reqwest::StatusCode;
use serde::Serialize;

#[derive(Debug)]
pub struct AppError {
    code: StatusCode,
    message: String,
}

impl AppError {
    pub fn new(code: StatusCode, message: impl Into<String>) -> Self {
        Self {
            code,
            message: message.into(),
        }
    }
}

#[derive(Serialize)]
struct ResponseMessage {
    code: String,
    message: String,
}

impl IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        println!("{:?}", self);
        (
            self.code,
            Json(ResponseMessage {
                code: self.code.to_string(),
                message: self.message,
            }),
        )
            .into_response()
    }
}
