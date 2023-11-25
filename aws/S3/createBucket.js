import { CreateBucketCommand } from "@aws-sdk/client-s3";

const createBucket = async ({ client, bucketName }) => {
  try {
    const response = await client.send(
      new CreateBucketCommand({
        Bucket: bucketName,
      })
    );
    console.log(`SUCCESFULLY CREATED S3 BUCKET ${bucketName}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};
export default createBucket;
