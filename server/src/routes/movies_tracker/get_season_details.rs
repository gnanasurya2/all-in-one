use std::env;

use axum::{
    extract::{Path, Query},
    http::StatusCode,
    Extension, Json,
};
use reqwest::Client;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder};
use serde::{Deserialize, Serialize};

use crate::{
    database::{movies, prelude::Movies},
    routes::guard::AuthData,
    utils::{app_error::AppError, format_date::format_date, type_conversion::i8_to_bool},
};

#[derive(Serialize, Deserialize)]
pub struct QueryParams {
    id: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct EpisodeResponse {
    #[serde(rename = "title", alias = "Title")]
    title: String,
    #[serde(rename = "released", alias = "Released")]
    released: String,
    #[serde(rename = "episode", alias = "Episode")]
    episode: String,
    #[serde(rename = "imdbRating")]
    imdb_rating: String,
    #[serde(rename = "imdbId", alias = "imdbID")]
    imdb_id: String,
}

#[derive(Serialize, Deserialize)]
pub struct GetSeasonDetailsResponse {
    #[serde(rename = "title", alias = "Title")]
    title: String,
    #[serde(rename = "season", alias = "Season")]
    season: String,
    #[serde(rename = "totalSeasons")]
    total_seasons: String,
    #[serde(rename = "episodes", alias = "Episodes")]
    episodes: Vec<EpisodeResponse>,
}

#[derive(Serialize, Deserialize)]
pub struct EpisodeApiResponse {
    #[serde(rename = "title", alias = "Title")]
    title: String,
    #[serde(rename = "released", alias = "Released")]
    released: String,
    #[serde(rename = "episode", alias = "Episode")]
    episode: String,
    #[serde(rename = "imdbRating")]
    imdb_rating: String,
    #[serde(rename = "imdbId", alias = "imdbID")]
    imdb_id: String,
    liked: Option<bool>,
    watched: Option<bool>,
    rating: Option<f32>,
    #[serde(rename = "watchedDate")]
    watched_date: Option<String>,
    #[serde(rename = "trackedId")]
    tracked_id: Option<i32>,
    #[serde(rename = "isLogged")]
    is_logged: bool,
}

#[derive(Serialize, Deserialize)]
pub struct GetSeasonDetailsApiResponse {
    #[serde(rename = "title", alias = "Title")]
    title: String,
    #[serde(rename = "season", alias = "Season")]
    season: String,
    #[serde(rename = "totalSeasons")]
    total_seasons: String,
    #[serde(rename = "episodes", alias = "Episodes")]
    episodes: Vec<EpisodeApiResponse>,
}

pub async fn get_season_details(
    Extension(client): Extension<Client>,
    Extension(database): Extension<DatabaseConnection>,
    Extension(user): Extension<AuthData>,
    Path(season_id): Path<String>,
    Query(query): Query<QueryParams>,
) -> Result<Json<GetSeasonDetailsApiResponse>, AppError> {
    let api_key = env::var("OMDB_API_KEY").unwrap();

    let request_url = format!(
        "https://www.omdbapi.com/?apikey={}&i={}&season={}",
        api_key, query.id, season_id
    );

    let response = client
        .get(request_url)
        .send()
        .await
        .map_err(|err| AppError::new(StatusCode::INTERNAL_SERVER_ERROR, err.to_string()))?;

    let body = response.text().await.map_err(|_| {
        AppError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            "Error while parsing the response",
        )
    })?;
    match serde_json::from_str::<GetSeasonDetailsResponse>(&body) {
        Ok(response) => {
            let watched_data = Movies::find()
                .filter(movies::Column::UserId.eq(user.id))
                .filter(movies::Column::ImdbId.eq(query.id))
                .filter(movies::Column::Season.eq(season_id))
                .order_by_asc(movies::Column::Episode)
                .all(&database)
                .await
                .map_err(|_| {
                    AppError::new(
                        StatusCode::INTERNAL_SERVER_ERROR,
                        "Error while retriving data",
                    )
                })?;
            let mut curr_idx = 0;
            let final_episode_data = response
                .episodes
                .iter()
                .map(|episode| {
                    let curr_episode_number = match watched_data.get(curr_idx) {
                        Some(data) => data.episode.unwrap_or(0).to_string(),
                        None => "0".to_owned(),
                    };
                    let mut episode_response = EpisodeApiResponse {
                        title: episode.title.clone(),
                        released: episode.released.clone(),
                        episode: episode.episode.clone(),
                        imdb_rating: episode.imdb_rating.clone(),
                        imdb_id: episode.imdb_id.clone(),
                        liked: None,
                        watched: None,
                        rating: None,
                        watched_date: None,
                        tracked_id: None,
                        is_logged: false,
                    };
                    if episode.episode == curr_episode_number {
                        episode_response.liked = Some(i8_to_bool(watched_data[curr_idx].liked));
                        episode_response.watched = Some(i8_to_bool(watched_data[curr_idx].watched));
                        episode_response.rating = Some(watched_data[curr_idx].rating);
                        episode_response.watched_date =
                            Some(format_date(watched_data[curr_idx].watched_date));
                        episode_response.tracked_id = Some(watched_data[curr_idx].id);
                        episode_response.is_logged = true;
                        curr_idx += 1;
                    }
                    return episode_response;
                })
                .collect::<Vec<EpisodeApiResponse>>();
            Ok(Json(GetSeasonDetailsApiResponse {
                title: response.title,
                season: response.season,
                total_seasons: response.total_seasons,
                episodes: final_episode_data,
            }))
        }
        Err(_) => Err(AppError::new(
            StatusCode::EXPECTATION_FAILED,
            "Error while parsing the json",
        )),
    }
}
