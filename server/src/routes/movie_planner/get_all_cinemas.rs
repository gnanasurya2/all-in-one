use axum::{extract::Query, http::StatusCode, Extension, Json};
use reqwest::Client;
use serde::{Deserialize, Serialize};

use crate::utils::app_error::AppError;

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Clone)]
pub struct MovieResponse {
    pub id: String,
    filmIds: Vec<String>,
    filmName: String,
    starring: String,
    director: String,
    imax: bool,
    releaseDate: String,
    ce: String,
    mlength: String,
    miv: String,
    mtrailerurl: String,
    synopsis: String,
    mfs: Vec<String>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
pub struct CinemaResponse {
    theatreId: String,
    name: String,
    // cityId: u32,
    showCount: u32,
    latitude: String,
    longitude: String,
    // movieRes: Vec<MovieResponse>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
pub struct TheatreOutputResponse {
    defaultDistance: u8,
    maxDistance: u8,
    c: Vec<CinemaResponse>,
}

#[derive(Serialize, Deserialize)]
pub struct GetAllTheatreApiResponse {
    msg: String,
    result: String,
    output: TheatreOutputResponse,
}

fn default_city() -> String {
    "Bengaluru".to_owned()
}

#[derive(Deserialize)]
pub struct QueryParams {
    #[serde(default = "default_city")]
    city: String,
    lat: String,
    lng: String,
}

#[derive(Serialize)]
pub struct RequestBody {
    city: String,
    lat: String,
    lng: String,
}

pub async fn get_all_cinemas(
    Extension(client): Extension<Client>,
    Query(query): Query<QueryParams>,
) -> Result<Json<GetAllTheatreApiResponse>, AppError> {
    let mut headers = reqwest::header::HeaderMap::new();

    headers.insert(
        "appversion",
        "1.0"
            .parse()
            .map_err(|_| AppError::new(StatusCode::BAD_REQUEST, "invalid header"))?,
    );
    headers.insert(
        "authorization",
        "Bearer"
            .parse()
            .map_err(|_| AppError::new(StatusCode::BAD_REQUEST, "invalid header"))?,
    );
    headers.insert(
        "chain",
        "PVR"
            .parse()
            .map_err(|_| AppError::new(StatusCode::BAD_REQUEST, "invalid header"))?,
    );
    headers.insert(
        "city",
        query
            .city
            .parse()
            .map_err(|_| AppError::new(StatusCode::BAD_REQUEST, "invalid header"))?,
    );
    headers.insert(
        "platform",
        "WEBSITE"
            .parse()
            .map_err(|_| AppError::new(StatusCode::BAD_REQUEST, "invalid header"))?,
    );
    headers.insert(
        "Content-Type",
        "application/json"
            .parse()
            .map_err(|_| AppError::new(StatusCode::BAD_REQUEST, "invalid header"))?,
    );

    let body: RequestBody = RequestBody {
        city: query.city,
        lat: query.lat,
        lng: query.lng,
    };

    let response = client
        .post("https://api3.pvrcinemas.com/api/v1/booking/content/cinemas")
        .headers(headers)
        .json(&body)
        .send()
        .await
        .map_err(|err| AppError::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string()))?;

    let body = response
        .json::<GetAllTheatreApiResponse>()
        .await
        .map_err(|err| AppError::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string()))?;

    Ok(Json(body))
}
