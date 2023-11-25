import { ApiGatewayV2Client } from "@aws-sdk/client-apigatewayv2";

const region = process.env.region;
const apiGatewayClient = new ApiGatewayV2Client({ region });
export default apiGatewayClient;
