import cloudFrontClient from "./CloudFront/cloudfrontClient.js";
import getFunctionUrl from "./Lambda/getFunctionUrl.js";
import OriginAccessControlList from "./CloudFront/OriginAccessControlList.js";
import createDistribution from "./CloudFront/createDistribution.js";
const { appName } = process.env;

const { FunctionUrl } = await getFunctionUrl({ FunctionName: appName });

const STATIC = OriginAccessControlList.Items.find(
  ({ Description }) => Description === appName + "static"
);
const STORAGE = OriginAccessControlList.Items.find(
  ({ Description }) => Description === appName + "storage"
);

const cloudfront = await createDistribution({
  client: cloudFrontClient,
  name: appName,
  staticOriginDomain: STATIC.Name,
  staticOAC_ID: STATIC.Id,
  storageOriginDomain: STORAGE.Name,
  storageOAC_ID: STORAGE.Id,
  lambdaUrlOriginDomain: new URL(FunctionUrl).hostname,
});
export default cloudfront;
