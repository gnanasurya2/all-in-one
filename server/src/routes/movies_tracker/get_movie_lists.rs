use std::collections::HashMap;

use axum::{extract::Query, http::StatusCode, Extension, Json};
use sea_orm::{DatabaseConnection, DbBackend, FromQueryResult, Statement};
use serde::{Deserialize, Serialize};

use crate::{routes::guard::AuthData, utils::app_error::AppError};

#[derive(Deserialize)]
pub struct QueryParams {
    page: u64,
    page_size: u64,
}

#[derive(Debug, FromQueryResult)]
pub struct BasicMovieLists {
    list_id: i32,
    list_name: String,
    description: Option<String>,
    poster: Option<String>,
    imdb_id: String,
}

#[derive(Debug, Serialize, Eq, PartialEq, Hash)]
pub struct HashKey {
    list_id: i32,
    list_name: String,
    description: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct MovieItem {
    url: Option<String>,
    imdb_id: String,
}
#[derive(Debug, Serialize)]
pub struct FinalResponse {
    data: HashKey,
    posters: Vec<MovieItem>,
}

#[derive(Serialize)]
pub struct ResponseMovieLists {
    response: Vec<FinalResponse>,
    has_more: bool,
    page_number: u64,
}
pub async fn get_movie_lists(
    Extension(database): Extension<DatabaseConnection>,
    Extension(user): Extension<AuthData>,
    Query(query): Query<QueryParams>,
) -> Result<Json<ResponseMovieLists>, AppError> {
    let has_more = false;

    let ranked_movie: Vec<BasicMovieLists> =
        BasicMovieLists::find_by_statement(Statement::from_sql_and_values(
            DbBackend::MySql,
            format!(r#"WITH RankedMovies AS (
                    SELECT
                        ml.poster,
                        ml.list_id,
                        ml.imdb_id,
                        ROW_NUMBER() OVER (PARTITION BY ml.list_id ORDER BY ml.updated_at DESC) AS row_num
                    FROM
                        movie_lists ml
                )

                SELECT
                    l.id AS list_id,
                    l.title AS list_name,
                    l.description,
                    rm.poster,
                    rm.imdb_id
                FROM
                    lists l 
                JOIN
                    RankedMovies rm ON  rm.list_id  = l.id
                INNER JOIN (
	                SELECT 
                        l1.id 
                    FROM 
                        lists l1 
                    WHERE 
                        l1.user_id = {} 
                    ORDER BY 
                        l1.updated_at 
                    DESC 
	                LIMIT {} 
	                OFFSET {}
                ) as l2 
                ON 
                    l.id = l2.id
                WHERE
                    rm.row_num <= 5;"#,user.id,query.page_size, (query.page - 1) * query.page_size),
            [],
        ))
        .all(&database)
        .await
        .map_err(|err| {
            AppError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "error while fetching the data",
            )
        })?;

    let mut lookup = HashMap::new();
    ranked_movie.into_iter().for_each(|item| {
        lookup
            .entry(HashKey {
                list_id: item.list_id,
                list_name: item.list_name,
                description: item.description,
            })
            .or_insert_with(Vec::new)
            .push(MovieItem {
                url: item.poster,
                imdb_id: item.imdb_id,
            });
    });

    Ok(Json(ResponseMovieLists {
        response: lookup
            .into_iter()
            .map(|item| FinalResponse {
                data: item.0,
                posters: item.1,
            })
            .collect::<Vec<FinalResponse>>(),
        has_more,
        page_number: query.page,
    }))
}
