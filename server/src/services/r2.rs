use std::{future::Future, pin::Pin, time::Duration};

use s3::{creds::Credentials, Bucket, Region};

#[derive(Clone)]
pub struct R2Store {
    bucket: s3::Bucket,
}
#[derive(Debug)]
pub enum StoreError {
    R2(s3::error::S3Error),
}

pub type AsyncStoreResult<'a, T> = Pin<Box<dyn Future<Output = Result<T, StoreError>> + 'a + Send>>;

pub trait Store {
    fn put_object<'a>(&'a self, filename: String, contents: &'a [u8]) -> AsyncStoreResult<'a, ()>;
    fn get_object(&self, filename: String) -> AsyncStoreResult<Option<Vec<u8>>>;
}

impl R2Store {
    pub fn new(
        access_key_id: String,
        secret_key_key: String,
        account_id: String,
        bucket_name: String,
    ) -> R2Store {
        let endpoint = format!("https://{}.r2.cloudflarestorage.com", account_id);
        let region = Region::Custom {
            region: String::from("auto"),
            endpoint,
        };
        let creds = Credentials::new(
            Some(&access_key_id),
            Some(&secret_key_key),
            None,
            None,
            None,
        )
        .unwrap();
        let mut bucket = Bucket::new(&bucket_name, region, creds).unwrap();

        bucket.set_request_timeout(Some(Duration::from_secs(10)));

        R2Store { bucket }
    }
}

impl Store for R2Store {
    fn get_object(&self, filename: String) -> AsyncStoreResult<Option<Vec<u8>>> {
        Box::pin(async move {
            let response = self.bucket.get_object(filename.clone()).await;
            match response {
                Ok(response) => Ok(Some(response.bytes().to_vec())),
                Err(e) => Err(StoreError::R2(e)),
            }
        })
    }
    fn put_object<'a>(&'a self, filename: String, contents: &'a [u8]) -> AsyncStoreResult<'a, ()> {
        Box::pin(async move {
            let response = self.bucket.put_object(filename.clone(), contents).await;

            match response {
                Ok(_) => Ok(()),
                Err(e) => Err(StoreError::R2(e)),
            }
        })
    }
}
