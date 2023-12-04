import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

declare global {
  interface Window {
    handleCreds: (response: any) => void;
  }
}
export default function GoogleSign({ clientId }: { clientId: string }) {
  const fetcher = useFetcher();

  useEffect(() => {
    const gsiScript = document.createElement("script");
    gsiScript.src = "https://accounts.google.com/gsi/client";
    gsiScript.async = true;
    gsiScript.defer = true;
    document.head.appendChild(gsiScript);
  }, []);

  !(typeof document === "undefined")
    ? (window.handleCreds = ({ credential }: any) => {
        fetcher.submit(
          {
            type: "google",
            accessToken: credential,
          },
          { method: "post", action: "/api/google" }
        );
      })
    : null;

  return (
    <>
      <div
        id="g_id_onload"
        data-client_id={clientId}
        data-callback="handleCreds"
        data-auto_prompt="false"
      ></div>
      {fetcher.state === "idle" ? (
        <div
          className="g_id_signin"
          data-type="standard"
          data-size="large"
          data-width="300"
          data-theme="outline"
          data-text="sign_in_with"
          data-shape="rectangular"
          data-logo_alignment="left"
        ></div>
      ) : (
        <i>{fetcher.state}</i>
      )}
    </>
  );
}
