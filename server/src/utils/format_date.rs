use chrono::{DateTime, NaiveDateTime, Utc};

pub fn format_date(date: Option<NaiveDateTime>) -> String {
    match date {
        Some(date) => date.format("%Y-%m-%dT%H:%M:%SZ").to_string(),
        None => "".to_owned(),
    }
}

pub fn format_date_utc(date: Option<DateTime<Utc>>) -> String {
    match date {
        Some(date) => date.format("%Y-%m-%dT%H:%M:%SZ").to_string(),
        None => Utc::now().format("%Y-%m-%dT%H:%M:%SZ").to_string(),
    }
}
