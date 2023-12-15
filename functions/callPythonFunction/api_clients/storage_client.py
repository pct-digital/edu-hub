import datetime
import io
import logging
import os
from typing import Optional
from google.cloud.storage import Client
from google import auth
from google.auth.transport import requests
import google_auth_oauthlib


class StorageClient:
    BUCKET_NAME = os.getenv(
        "BUCKET_NAME",  # Bucket name for cloud storage
        "emulated-bucket",  # Default value for testing outside the container
    )
    BUCKET_DIRECTORY = os.getenv(
        "LOCAL_BUCKET_DIRECTORY",  # Base directory for local storage
        "",  # Default value for testing outside the container
    )
    STORAGE_PORT = os.getenv(
        "LOCAL_STORAGE_PORT",  # Base directory for local storage
        "4001",  # Default value for testing outside the container
    )

    def __init__(self):
        self.bucket_name = self.BUCKET_NAME
        self.env = os.environ.get("ENVIRONMENT", "development")
        if self.env == "development":
            self.storage_client = None
        else:
            self.storage_client = Client()

    def get_bucket(self):
        if self.env == "development":
            return self.bucket_name  # In local mode, just return the bucket name
        else:
            return self.storage_client.bucket(self.bucket_name)

    def list_blobs(self):
        if self.env == "development":
            path = os.path.join(self.BUCKET_DIRECTORY, self.bucket_name)
            return [
                f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))
            ]
        else:
            blobs = self.storage_client.list_blobs(self.bucket_name)
            return blobs

    def get_blob(self, blob_name):
        if self.env == "development":
            blob_path = os.path.join(self.BUCKET_DIRECTORY, self.bucket_name, blob_name)
            return blob_path
        else:
            return self.storage_client.bucket(self.bucket_name).blob(blob_name)

    def get_blob_metadata(self, blob_name):
        # For local environment, we won't have any cloud-based metadata.
        # Just returning file stats as an example.
        if self.env == "development":
            file_path = os.path.join(self.BUCKET_DIRECTORY, self.bucket_name, blob_name)
            if os.path.exists(file_path):
                return os.stat(file_path)
            return {}
        else:
            blob = self.storage_client.bucket(self.bucket_name).blob(blob_name)
            return blob.metadata

    def delete_blob(self, blob_name):
        if self.env == "development":
            file_path = os.path.join(self.BUCKET_DIRECTORY, self.bucket_name, blob_name)
            if os.path.exists(file_path):
                os.remove(file_path)
        else:
            blob = self.storage_client.bucket(self.bucket_name).blob(blob_name)
            blob.delete()

    def download_file(self, blob_name, file_path):
        if self.env == "development":
            src_path = os.path.join(self.BUCKET_DIRECTORY, self.bucket_name, blob_name)
            os.replace(src_path, file_path)
        else:
            blob = self.storage_client.bucket(self.bucket_name).blob(blob_name)
            blob.download_to_filename(file_path)

    # def upload_file(self, blob_name, file_path):
    #     if self.env == "development":
    #         dest_path = os.path.join(self.BUCKET_DIRECTORY, self.bucket_name, blob_name)
    #         os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    #         os.replace(file_path, dest_path)
    #     else:
    #         blob = self.storage_client.bucket(self.bucket_name).blob(blob_name)
    #         blob.upload_from_filename(file_path)

    def make_signed_upload_url(self, blob: google_auth_oauthlib.cloud.storage.blob.Blob, exp: Optional[datetime.timedelta] = None, content_type="application/octet-stream", min_size=1, max_size=int(1e6)):
        """
        Compute a GCS signed upload URL without needing a private key file.
        Can only be called when a service account is used as the application
        default credentials, and when that service account has the proper IAM
        roles, like `roles/storage.objectCreator` for the bucket, and
        `roles/iam.serviceAccountTokenCreator`.
        Source: https://stackoverflow.com/a/64245028
        See also: https://medium.com/@evanpeterson17/how-to-generate-signed-urls-using-python-in-google-cloud-run-835ddad5366

        Parameters
        ----------
        blob : google.cloud.storage.blob.Blob
            Object that contains the blob information.
        exp : timedelta, optional
            Time from now when the signed url will expire.
        content_type : str, optional
            The required mime type of the data that is uploaded to the generated
            signed url.
        min_size : int, optional
            The minimum size the uploaded file can be, in bytes (inclusive).
            If the file is smaller than this, GCS will return a 400 code on upload.
        max_size : int, optional
            The maximum size the uploaded file can be, in bytes (inclusive).
            If the file is larger than this, GCS will return a 400 code on upload.
        """
        if exp is None:
            exp = datetime.timedelta(hours=1)
        credentials, project_id = auth.default()
        if credentials.token is None:
            # Perform a refresh request to populate the access token of the
            # current credentials.
            credentials.refresh(requests.Request())
        # client = Client()
        # bucket = client.get_bucket(bucket)
        # blob = bucket.blob(blob)
        return blob.generate_signed_url(
            version="v4",
            expiration=exp,
            service_account_email=credentials.service_account_email,
            access_token=credentials.token,
            method="PUT",
            content_type=content_type,
            headers={"X-Goog-Content-Length-Range": f"{min_size},{max_size}"}
        )

    def upload_csv_from_dataframe(self, path, blob_name, dataframe, **csv_args):
        """
        Uploads a pandas DataFrame as a CSV file to the specified bucket, path, and blob_name.
        Returns a link to the uploaded blob.
        """

        full_blob_path = os.path.join(path, blob_name) if path else blob_name

        # Set default values for separator and decimal. If provided in csv_args, they will overwrite these.
        default_csv_args = {"sep": ";", "decimal": ","}
        default_csv_args.update(csv_args)  # merge default args with any provided csv_args

        if self.env == "development":
            local_container_path = os.path.join("/home/node/www/", self.bucket_name, full_blob_path)
            logging.debug(f"local container path: {local_container_path}")
            os.makedirs(os.path.dirname(local_container_path), exist_ok=True)
            dataframe.to_csv(local_container_path, **default_csv_args)
            return f"http://localhost:{self.STORAGE_PORT}/{self.bucket_name}/{full_blob_path}"
        else:
            # Use a BytesIO buffer to upload the DataFrame directly to GCS
            buffer = io.BytesIO()
            dataframe.to_csv(buffer, index=False, **default_csv_args)
            buffer.seek(0)  # Reset buffer position to the beginning after writing

            blob = self.storage_client.bucket(self.bucket_name).blob(full_blob_path)
            blob.upload_from_file(buffer, content_type='text/csv')

            # Generate signed URL with access token
            url = self.make_signed_upload_url(
                blob,
                exp=datetime.timedelta(minutes=15),
                content_type="text/csv",
            )

            return url
