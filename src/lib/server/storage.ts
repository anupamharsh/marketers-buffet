import "server-only";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/*
 * Template files sit in the private "template-files" bucket. Buyers never get
 * a permanent URL: each download link is signed on request and expires.
 */
let client: S3Client | null = null;
function s3() {
  if (!client) {
    client = new S3Client({
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION,
      forcePathStyle: true,
      credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID || "", secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "" },
    });
  }
  return client;
}

export async function signedDownload(key: string, filename: string, expiresIn = 600) {
  const cmd = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_FILES || "template-files",
    Key: key,
    ResponseContentDisposition: `attachment; filename="${filename.replace(/[^a-zA-Z0-9._ -]/g, "")}"`,
  });
  return getSignedUrl(s3(), cmd, { expiresIn });
}
