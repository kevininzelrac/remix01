import type { MetaFunction } from "@remix-run/node";

import ErrorBoundary from "~/components/errorBoundary";
export { ErrorBoundary };

export const meta: MetaFunction = () => {
  return [{ title: "Home" }, { name: "description", content: "Home" }];
};

export default function Index() {
  return (
    <main>
      <h2>Home</h2>
      Remix v2.3.1 • Vite Plugin • AWS infrastructure
      <ul>
        <li>
          <strong>Back-End :</strong> AWS Lambda Function Url & Http Stream
          Custom Lambda / Remix Adapter
        </li>
        <li>
          <strong>Front-End :</strong> AWS S3 Bucket CDN : Cloudfront
          Distribution
        </li>
        <li>
          <strong>Real Time Data :</strong> API Gateway Websocket CI/CD : Github
          Actions
        </li>
      </ul>
    </main>
  );
}
