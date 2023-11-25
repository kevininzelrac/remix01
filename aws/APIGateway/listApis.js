import { GetApisCommand } from "@aws-sdk/client-apigatewayv2";
import apiGatewayClient from "./apiGatewayClient.js";

const listApis = await apiGatewayClient.send(
  new GetApisCommand({
    MaxResults: "10",
  })
);
export default listApis;
