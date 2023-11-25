import s3Client from "./S3/s3Client.js";
import createBucket from "./S3/createBucket.js";

const storageBucket = await createBucket({
  client: s3Client,
  bucketName: process.env.appName + "storage",
});
export default storageBucket;
