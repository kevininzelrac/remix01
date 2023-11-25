import { CreateDeploymentCommand } from "@aws-sdk/client-apigatewayv2";
import apiGatewayClient from "./apiGatewayClient.js";

const createDeployment = async ({ ApiId, StageName }) => {
  try {
    const response = await apiGatewayClient.send(
      new CreateDeploymentCommand({
        ApiId: ApiId,
        Description: ApiId,
        StageName: StageName,
      })
    );
    console.log(`SUCCESFULLY CREATED DEPLOYMENT ${ApiId}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};
export default createDeployment;
