import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

export default function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <div className="error" style={{ color: "crimson" }}>
      <h2>Oops!</h2>
      <p>
        {isRouteErrorResponse(error)
          ? `${error.status} ${error.statusText}`
          : error instanceof Error
          ? error.message
          : "Unknown Error"}
      </p>
    </div>
  );
}
