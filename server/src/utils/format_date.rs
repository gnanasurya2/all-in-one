use chrono::NaiveDateTime;

pub fn format_date(date: Option<NaiveDateTime>) -> String {
    match date {
        Some(date) => date.format("%Y-%m-%dT%H:%M:%SZ").to_string(),
        None => "".to_owned(),
    }
}
