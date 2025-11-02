use std::collections::HashMap;

use crate::routes::movie_planner::{get_all_shows::ShowResponse, plan_movies::Contraints};

fn are_non_overlapping(
    show_a: &ShowResponse,
    show_b: &ShowResponse,
    constraints: &Contraints,
) -> bool {
    (show_a.endTimeStamp <= constraints.endTimeStamp
        && show_b.endTimeStamp <= constraints.endTimeStamp
        && show_a.showTimeStamp >= constraints.startTimeStamp
        && show_b.showTimeStamp >= constraints.startTimeStamp)
        && show_a.endTimeStamp <= show_b.showTimeStamp
        || show_b.endTimeStamp <= show_a.showTimeStamp
}

// Helper to check if all shows in a vector are non-overlapping
fn all_non_overlapping(shows: &[&ShowResponse], constraints: &Contraints) -> bool {
    for i in 0..shows.len() {
        for j in (i + 1)..shows.len() {
            if !are_non_overlapping(shows[i], shows[j], constraints) {
                return false;
            }
        }
    }
    true
}

pub fn movie_scheduler(
    shows: HashMap<String, Vec<ShowResponse>>,
    constraints: Contraints,
) -> Vec<HashMap<String, Vec<ShowResponse>>> {
    let movie_ids: Vec<String> = shows.keys().cloned().collect();
    let mut results = Vec::new();
    let mut selected: Vec<ShowResponse> = Vec::new();

    fn backtrack(
        idx: usize,
        movie_ids: &Vec<String>,
        shows: &HashMap<String, Vec<ShowResponse>>,
        selected: &mut Vec<ShowResponse>,
        results: &mut Vec<HashMap<String, Vec<ShowResponse>>>,
        constraints: &Contraints,
    ) {
        if idx == movie_ids.len() {
            let selected_refs: Vec<&ShowResponse> = selected.iter().collect();
            if all_non_overlapping(&selected_refs, constraints) {
                let mut result = HashMap::new();
                for (i, movie_id) in movie_ids.iter().enumerate() {
                    result.insert(movie_id.clone(), vec![selected[i].clone()]);
                }
                results.push(result);
            }
            return;
        }
        let movie_id = &movie_ids[idx];
        if let Some(show_list) = shows.get(movie_id) {
            for show in show_list {
                selected.push(show.clone());
                backtrack(idx + 1, movie_ids, shows, selected, results, constraints);
                selected.pop();
            }
        }
    }

    backtrack(
        0,
        &movie_ids,
        &shows,
        &mut selected,
        &mut results,
        &constraints,
    );
    results
}
