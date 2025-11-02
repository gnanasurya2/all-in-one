use axum::{extract::Query, http::StatusCode, Extension, Json};
use reqwest::Client;
use serde::{Deserialize, Serialize};

use crate::utils::app_error::AppError;

#[derive(Serialize, Deserialize)]
pub struct QueryParams {
    word: String,
}

#[derive(Serialize, Deserialize)]
pub struct PhoneticResponse {
    text: String,
    audio: String,
}

#[derive(Serialize, Deserialize)]
pub struct DefinitionsResponse {
    definition: String,
    example: Option<String>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
pub struct MeaningResponse {
    partOfSpeech: String,
    definitions: Vec<DefinitionsResponse>,
}

#[derive(Serialize, Deserialize)]
pub struct WordApiResponse {
    word: String,
    phonetic: Option<String>,
    phonetics: Vec<PhoneticResponse>,
    meanings: Vec<MeaningResponse>,
}

pub async fn query_word(
    Extension(client): Extension<Client>,
    Query(query): Query<QueryParams>,
) -> Result<Json<Vec<WordApiResponse>>, AppError> {
    let request_url = format!(
        "https://api.dictionaryapi.dev/api/v2/entries/en/{}",
        query.word
    );

    let response = client
        .get(request_url)
        .send()
        .await
        .map_err(|err| AppError::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string()))?;

    let body = response
        .json::<Vec<WordApiResponse>>()
        .await
        .map_err(|E| AppError::new(StatusCode::BAD_REQUEST, E.to_string()))?;

    Ok(Json(body))
}
