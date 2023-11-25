import s3Client from "./S3/s3Client.js";
import createBucket from "./S3/createBucket.js";

const staticBucket = await createBucket({
  client: s3Client,
  bucketName: process.env.appName + "static",
});
export default staticBucket;
