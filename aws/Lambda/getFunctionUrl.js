import { GetFunctionUrlConfigCommand } from "@aws-sdk/client-lambda";
import lambdaClient from "./lambdaClient.js";

const getFunctionUrl = async ({ FunctionName }) => {
  try {
    const response = await lambdaClient.send(
      new GetFunctionUrlConfigCommand({
        FunctionName: FunctionName,
      })
    );
    console.log(`SUCCESFULLY GET LAMBDA FUNCTION URL ${response.FunctionUrl}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};
export default getFunctionUrl;

// { // GetFunctionUrlConfigResponse
//   FunctionUrl: "STRING_VALUE", // required
//   FunctionArn: "STRING_VALUE", // required
//   AuthType: "NONE" || "AWS_IAM", // required
//   Cors: { // Cors
//     AllowCredentials: true || false,
//     AllowHeaders: [ // HeadersList
//       "STRING_VALUE",
//     ],
//     AllowMethods: [ // AllowMethodsList
//       "STRING_VALUE",
//     ],
//     AllowOrigins: [ // AllowOriginsList
//       "STRING_VALUE",
//     ],
//     ExposeHeaders: [
//       "STRING_VALUE",
//     ],
//     MaxAge: Number("int"),
//   },
//   CreationTime: "STRING_VALUE", // required
//   LastModifiedTime: "STRING_VALUE", // required
//   InvokeMode: "BUFFERED" || "RESPONSE_STREAM",
// };
