use std::{env, fs, process::Command};

use chrono::Utc;
use log::{error, info};
use tokio_cron_scheduler::{Job, JobScheduler, JobSchedulerError};

use crate::services::r2::{R2Store, Store};
pub async fn backup_scheduler(r2_store: &R2Store) -> Result<(), JobSchedulerError> {
    let sched: JobScheduler = JobScheduler::new().await?;
    let r2_store = r2_store.clone();
    sched
        .add(Job::new_async("0 0 5 * * *", move |uuid, mut l| {
            let r2_store = r2_store.clone();
            Box::pin(async move {
                println!("running database backup at {}", Utc::now());
                backup_db(r2_store).await;

                let next_tick = l.next_tick_for_job(uuid).await;
                match next_tick {
                    Ok(Some(ts)) => info!("next execution timestamp is {:?}", ts),
                    _ => info!("couldn't get the next timestamp"),
                }
            })
        })?)
        .await?;

    sched.start().await?;
    Ok(())
}

pub async fn backup_db(r2_store: R2Store) {
    let password = env::var("MYSQL_ROOT_PASSWORD").unwrap();
    let base_path = env::var("BACKUP_PATH").unwrap();
    let db_name = env::var("MYSQL_DATABASE").unwrap();
    let db_host = env::var("MYSQL_HOST").unwrap();

    let file_name = format!("db_backup_{}.sql", Utc::now().timestamp());
    let final_path = format!("{}/{}", base_path, file_name);
    let output = Command::new("mysqldump")
        .arg("-u")
        .arg("root")
        .arg("-h")
        .arg(db_host)
        .arg(format!("-p{}", password))
        .arg(db_name)
        .arg("--complete-insert")
        .arg("-r")
        .arg(&final_path)
        .output()
        .expect("command failed");

    let data = fs::read(&final_path).unwrap();

    let file_data = r2_store.put_object(file_name, &data).await;

    match file_data {
        Ok(_) => {
            println!("total bytes - {}", data.len());
            match fs::remove_file(&final_path) {
                Ok(_) => info!("{} removed sucessfully", final_path),
                Err(e) => error!("error while removing {}, {}", final_path, e),
            }
        }
        Err(e) => error!("get file error {:?}", e),
    }

    if output.status.success() {
        info!("Database backup completed successfully.");
    } else {
        info!("Failed to backup database: {:?}", output);
    }
}
