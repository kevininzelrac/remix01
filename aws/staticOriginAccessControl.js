import { CloudFrontClient } from "@aws-sdk/client-cloudfront";
import createOriginAccessControl from "./CloudFront/createOriginAccess.js";
const { appName, region } = process.env;

const cloudFrontClient = new CloudFrontClient({ region });

const { OriginAccessControl } = await createOriginAccessControl({
  client: cloudFrontClient,
  id: `${appName}static.s3.${region}.amazonaws.com`,
  description: `${appName}static`,
});
export default OriginAccessControl;
