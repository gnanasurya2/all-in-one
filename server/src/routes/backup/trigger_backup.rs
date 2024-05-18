use axum::Extension;

use crate::{scheduler::backup_scheduler::backup_db, services::r2::R2Store};

pub async fn trigger_backup(Extension(r2_store): Extension<R2Store>) -> String {
    backup_db(r2_store).await;

    "backup is successful".to_owned()
}
