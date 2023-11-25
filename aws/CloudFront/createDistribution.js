import { CreateDistributionCommand } from "@aws-sdk/client-cloudfront";

const createDistribution = async ({
  client,
  name,
  staticOriginDomain,
  staticOAC_ID,
  storageOriginDomain,
  storageOAC_ID,
  lambdaUrlOriginDomain,
}) => {
  try {
    const response = await client.send(
      new CreateDistributionCommand({
        DistributionConfig: {
          PriceClass: "PriceClass_All",
          HttpVersion: "http2",
          IsIPV6Enabled: true,
          CallerReference: name, // required
          Enabled: true, // required
          Comment: name,
          Origins: {
            Quantity: 3, // required
            Items: [
              {
                Id: "static", // required
                DomainName: staticOriginDomain, // required
                S3OriginConfig: {
                  OriginAccessIdentity: "",
                },
                OriginAccessControlId: staticOAC_ID,
                ConnectionAttempts: 3,
                ConnectionTimeout: 10,
                OriginShield: {
                  Enabled: false, // required
                },
              },
              {
                Id: "storage", // required
                DomainName: storageOriginDomain, // required
                S3OriginConfig: {
                  OriginAccessIdentity: "",
                },
                OriginAccessControlId: storageOAC_ID,
                ConnectionAttempts: 3,
                ConnectionTimeout: 10,
                OriginShield: {
                  Enabled: false, // required
                },
              },
              {
                Id: "lambda", // required
                DomainName: lambdaUrlOriginDomain, // required
                CustomOriginConfig: {
                  OriginProtocolPolicy: "https-only", // required
                  HTTPPort: 80, // required
                  HTTPSPort: 443, // required
                  OriginSslProtocols: {
                    Quantity: 1, // required
                    Items: ["TLSv1.2"],
                  },
                  OriginReadTimeout: 30,
                  OriginKeepaliveTimeout: 5,
                },
                ConnectionAttempts: 3,
                ConnectionTimeout: 10,
                OriginShield: {
                  Enabled: false, // required
                },
              },
            ],
          },
          DefaultCacheBehavior: {
            TargetOriginId: "lambda", // required
            Compress: true,
            ViewerProtocolPolicy: "https-only", // required
            AllowedMethods: {
              Quantity: 7,
              Items: [
                "GET",
                "HEAD",
                "OPTIONS",
                "PUT",
                "POST",
                "PATCH",
                "DELETE",
              ],
              CachedMethods: {
                Quantity: 2,
                Items: ["HEAD", "GET"],
              },
            },
            CachePolicyId: "4135ea2d-6df8-44a3-9df3-4b5a84be39ad",
            OriginRequestPolicyId: "b689b0a8-53d0-40ab-baf2-68738e2966ac",
            SmoothStreaming: false,
          },
          CacheBehaviors: {
            Quantity: 3,
            Items: [
              {
                PathPattern: "build/*", // required
                TargetOriginId: "static", // required
                ViewerProtocolPolicy: "https-only", // required
                AllowedMethods: {
                  Quantity: 2,
                  Items: ["GET", "HEAD"],
                  CachedMethods: {
                    Quantity: 2,
                    Items: ["HEAD", "GET"],
                  },
                },
                SmoothStreaming: false,
                Compress: true,
                CachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6",
              },
              {
                PathPattern: "storage/*", // required
                TargetOriginId: "storage", // required
                ViewerProtocolPolicy: "https-only", // required
                AllowedMethods: {
                  Quantity: 7,
                  Items: [
                    "GET",
                    "HEAD",
                    "OPTIONS",
                    "PUT",
                    "POST",
                    "PATCH",
                    "DELETE",
                  ],
                  CachedMethods: {
                    Quantity: 2,
                    Items: ["HEAD", "GET"],
                  },
                },
                SmoothStreaming: false,
                Compress: true,
                CachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6",
              },
              {
                PathPattern: "/favicon.ico", // required
                TargetOriginId: "static", // required
                ViewerProtocolPolicy: "https-only", // required
                AllowedMethods: {
                  Quantity: 2,
                  Items: ["GET", "HEAD"],
                  CachedMethods: {
                    Quantity: 2,
                    Items: ["HEAD", "GET"],
                  },
                },
                SmoothStreaming: false,
                Compress: true,
                CachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6",
              },
            ],
          },
        },
      })
    );
    console.log(`SUCCESFULLY CREATED CLOUDFRONT DISTRIBUTION ${name}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};
export default createDistribution;
