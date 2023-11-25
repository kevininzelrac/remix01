import { CreateOriginAccessControlCommand } from "@aws-sdk/client-cloudfront";

const createOriginAccessControl = async ({ client, id, description }) => {
  try {
    const response = await client.send(
      new CreateOriginAccessControlCommand({
        OriginAccessControlConfig: {
          Name: id, // required
          Description: description,
          SigningProtocol: "sigv4", // required
          SigningBehavior: "always", // required
          OriginAccessControlOriginType: "s3",
        },
      })
    );
    console.log(`SUCCESFULLY CREATED ORIGIN ACCESS CONTROL FOR ${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};
export default createOriginAccessControl;
