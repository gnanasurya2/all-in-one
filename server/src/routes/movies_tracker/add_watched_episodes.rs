use axum::http::StatusCode;
use axum::{Extension, Json};
use chrono::{Datelike, NaiveDateTime};
use sea_orm::{DatabaseConnection, EntityTrait, Set};
use serde::{Deserialize, Serialize};

use crate::database::{
    movies::{self, ActiveModel},
    prelude::Movies,
};
use crate::routes::guard::AuthData;
use crate::utils::app_error::AppError;

#[derive(Deserialize)]
pub struct EpisodeData {
    season: i32,
    episode: i32,
    rating: f32,
    title: String,
    #[serde(rename = "watched_time", alias = "watchedTime")]
    watched_time: String,
    year: i32,
}

#[derive(Deserialize)]
pub struct RequestAddWatchedMovie {
    title: String,
    #[serde(rename = "imdb_id", alias = "imdbId")]
    imdb_id: String,
    poster: String,
    episodes: Vec<EpisodeData>,
}

#[derive(Serialize)]
pub struct ResponseAddWatchedMovie {
    status: String,
}

pub async fn add_watched_episodes(
    Extension(database): Extension<DatabaseConnection>,
    Extension(user): Extension<AuthData>,
    Json(request_payload): Json<RequestAddWatchedMovie>,
) -> Result<Json<ResponseAddWatchedMovie>, AppError> {
    let episode_list = request_payload
        .episodes
        .iter()
        .map(|episode| {
            let watched_date =
                NaiveDateTime::parse_from_str(&episode.watched_time, "%Y-%m-%dT%H:%M:%S%.3fZ")
                    .map_err(|_| {
                        AppError::new(
                            StatusCode::INTERNAL_SERVER_ERROR,
                            "Error while parsing the string",
                        )
                    })
                    .unwrap_or_default();

            return movies::ActiveModel {
                imdb_id: Set(request_payload.imdb_id.clone()),
                user_id: Set(user.id),
                rating: Set(episode.rating),
                season: Set(Some(episode.season)),
                episode: Set(Some(episode.episode)),
                watched_date: Set(Some(watched_date)),
                watched: Set(Some(1)),
                poster: Set(Some(request_payload.poster.clone())),
                year: Set(episode.year),
                title: Set(format!(
                    "S{} E{}: {}",
                    episode.season, episode.episode, episode.title
                )),
                r#type: Set(Some("series".to_owned())),
                ..Default::default()
            };
        })
        .collect::<Vec<ActiveModel>>();

    Movies::insert_many(episode_list)
        .exec(&database)
        .await
        .map_err(|err| {
            print!("err {:?}", err);
            AppError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "error while adding to db",
            )
        })?;

    Ok(Json(ResponseAddWatchedMovie {
        status: "Episodes updated".to_owned(),
    }))
}
