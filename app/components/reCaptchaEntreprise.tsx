import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

type ReCaptchaProps = {
  siteKey: string;
  action: string;
  onTokenChange: (token: string) => void;
  onError: (error: any) => void;
};

export default function ReCaptchaEnterprise({
  siteKey,
  action,
  onTokenChange,
  onError,
}: ReCaptchaProps) {
  const [recaptchaToken, setRecaptchaToken] = useState<string>("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;

    const handleScriptLoad = () => {
      window.grecaptcha.enterprise.ready(() => {
        window.grecaptcha.enterprise
          .execute(siteKey, {
            action: action || "DEFAULT_ACTION",
          })
          .then((token: string) => {
            setRecaptchaToken(token);
            onTokenChange && onTokenChange(token);
          })
          .catch((error: any) => {
            console.error("reCAPTCHA execution error:", error);
            onError && onError(error);
          });
      });
    };

    const handleScriptError = (event: Event | string) => {
      console.error("Error loading reCAPTCHA script:", event);
      onError && onError(event);
    };

    script.addEventListener("load", handleScriptLoad);
    script.addEventListener("error", handleScriptError);

    document.head.appendChild(script);

    return () => {
      // Cleanup on component unmount
      script.removeEventListener("load", handleScriptLoad);
      script.removeEventListener("error", handleScriptError);
      document.head.removeChild(script);
    };
  }, [siteKey, action, onTokenChange, onError]);

  return (
    <>
      <input type="hidden" name="token" value={recaptchaToken} />
      <div style={styles.div}>
        This site is protected by reCAPTCHA and the Google{" "}
        <a href="https://policies.google.com/privacy" style={styles.a}>
          Privacy Policy{" "}
        </a>{" "}
        and{" "}
        <a href="https://policies.google.com/terms" style={styles.a}>
          Terms of Service
        </a>{" "}
        apply.
      </div>
    </>
  );
}

const divStyle: React.CSSProperties = {
  color: "#323232",
  fontSize: ".5rem",
  margin: "4px",
};

const linkStyle: React.CSSProperties = {
  color: "#323232",
  fontSize: ".5rem",
  textTransform: "lowercase",
};

const styles = {
  div: divStyle,
  a: linkStyle,
};
