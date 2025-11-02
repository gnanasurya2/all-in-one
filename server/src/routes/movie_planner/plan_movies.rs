use std::collections::HashMap;

use axum::Json;
use serde::{Deserialize, Serialize};

use crate::{
    routes::movie_planner::{
        get_all_cinemas::MovieResponse,
        get_all_shows::{ExperienceSessionResponse, ShowResponse},
        utils::movie_scheduler::movie_scheduler,
    },
    utils::app_error::AppError,
};

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
pub struct Movie {
    movieRe: MovieResponse,
    experienceSessions: Vec<ExperienceSessionResponse>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
pub struct Contraints {
    pub endTimeStamp: u64,
    pub startTimeStamp: u64,
}

#[derive(Serialize, Deserialize)]
pub struct PlanMovieRequest {
    movies: Vec<Movie>,
    constraints: Contraints,
}

#[derive(Serialize, Deserialize)]
pub struct FormattedPlanMovie {
    id: String,
    shows: Vec<ShowResponse>,
}

pub async fn plan_movies(
    Json(mut request_payload): Json<PlanMovieRequest>,
) -> Result<Json<Vec<HashMap<String, Vec<ShowResponse>>>>, AppError> {
    let mut movies: Vec<FormattedPlanMovie> = vec![];
    let mut movies_map: HashMap<String, Vec<ShowResponse>> = HashMap::new();

    request_payload.movies.iter_mut().for_each(|movie| {
        let mut shows: Vec<ShowResponse> = vec![];
        movie.experienceSessions.iter_mut().for_each(|experience| {
            shows.append(&mut experience.shows.clone());
        });

        movies.push(FormattedPlanMovie {
            id: movie.movieRe.id.clone(),
            shows: shows.clone(),
        });

        movies_map.insert(movie.movieRe.id.clone(), shows);
    });

    let recommened_shows = movie_scheduler(movies_map, request_payload.constraints);

    Ok(Json(recommened_shows))
}
