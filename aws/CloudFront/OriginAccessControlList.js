import cloudFrontClient from "./cloudfrontClient.js";
import { ListOriginAccessControlsCommand } from "@aws-sdk/client-cloudfront";

const { OriginAccessControlList } = await cloudFrontClient.send(
  new ListOriginAccessControlsCommand({
    //Marker: "STRING_VALUE",
    MaxItems: "20",
  })
);
export default OriginAccessControlList;
