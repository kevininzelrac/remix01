import { CloudFrontClient } from "@aws-sdk/client-cloudfront";

const cloudFrontClient = new CloudFrontClient({ region: process.env.region });
export default cloudFrontClient;
