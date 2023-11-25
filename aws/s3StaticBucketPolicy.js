import s3Client from "./S3/s3Client.js";
import putBucketPolicy from "./S3/putBucketPolicy.js";
const { appName } = process.env;
import DistributionList from "./CloudFront/distributionList.js";
const { ARN } = DistributionList.Items.find(
  ({ Comment }) => Comment === appName
);

const s3StaticBucketPolicy = await putBucketPolicy({
  client: s3Client,
  name: appName + "static",
  document: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "AllowCloudFrontServicePrincipal",
        Effect: "Allow",
        Principal: {
          Service: "cloudfront.amazonaws.com",
        },
        Action: "s3:GetObject",
        Resource: `arn:aws:s3:::${appName}static/*`,
        Condition: {
          StringEquals: {
            "AWS:SourceArn": ARN,
          },
        },
      },
    ],
  }),
});
export default s3StaticBucketPolicy;
