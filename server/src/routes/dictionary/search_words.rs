use std::collections::HashSet;

use axum::{
    extract::{Query, State},
    http::StatusCode,
    Json,
};
use fst::{automaton::Str, Automaton, IntoStreamer};
use serde::Deserialize;

use crate::{utils::app_error::AppError, AppState};

#[derive(Deserialize)]
pub struct SearchParams {
    word: String,
}

pub async fn search_words(
    State(state): State<AppState>,
    Query(query): Query<SearchParams>,
) -> Result<Json<Vec<(u32, String)>>, AppError> {
    let word = query.word.trim().to_lowercase();

    if word.is_empty() {
        return Err(AppError::new(
            StatusCode::BAD_REQUEST,
            "Search word cannot be empty".to_string(),
        ));
    }

    let aut = Str::new(&word).starts_with();

    let mut prefix = state
        .fst_set
        .search(aut)
        .into_stream()
        .into_strs()
        .unwrap_or_default();

    if prefix.len() > 50 {
        prefix.truncate(50);
    }

    let mut fuzzy: Vec<(u32, &String)> = Vec::new();

    if prefix.len() < 50 {
        fuzzy = state.bk_tree.find(&word, 1).collect();
    }

    let mut seen = HashSet::new();
    let mut candidates: Vec<(u32, String)> = Vec::new();

    for w in prefix {
        if seen.insert(w.clone()) {
            let d = strsim::levenshtein(&word, &w) as u32;
            candidates.push((d, w.clone()));
        }
    }

    for (d, w) in fuzzy {
        if seen.insert(w.clone()) {
            candidates.push((d, w.clone()));
        }
    }

    candidates.sort_by(|(d1, w1), (d2, w2)| {
        d1.cmp(d2).then_with(|| match w1.len().cmp(&w2.len()) {
            std::cmp::Ordering::Equal => w1.cmp(w2),
            other => other,
        })
    });

    Ok(Json(candidates))
}
