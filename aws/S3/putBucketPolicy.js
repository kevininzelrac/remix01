import { PutBucketPolicyCommand } from "@aws-sdk/client-s3";

export const putBucketPolicy = async ({ client, name, document }) => {
  try {
    const response = await client.send(
      new PutBucketPolicyCommand({
        Bucket: name,
        Policy: document,
      })
    );
    console.log(`SUCCESFULLY CREATED S3 BUCKET POLICY FOR ${name}`);
    return response;
  } catch (err) {
    console.error(err);
  }
};
export default putBucketPolicy;
