/* 
ENV
GMAIL_USER="xxx@gmail.com"
GMAIL_SECRET="xxx"

RECAPTCHA_PROJECT_ID="xxx"
RECAPTCHA_SITE_KEY="xxx"
GOOGLE_API_KEY="xxx"
*/

import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import ReCaptchaEnterprise from "~/components/reCaptchaEntreprise";

import { loader } from "./loader";
import { action } from "./action";

import "./styles.css";
export { loader, action };

export default function Contact() {
  const { siteKey } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const formRef = useRef<HTMLFormElement>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  let isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.data && fetcher.state === "idle") {
      formRef.current?.reset();
      setShowSuccessMessage(true);

      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [fetcher.data, fetcher.state]);

  const handleError = (error: any) => {
    console.error("Error in reCAPTCHA:", error);
  };

  return (
    <main>
      <fetcher.Form
        method="post"
        ref={formRef}
        aria-disabled={isSubmitting}
        style={{ opacity: isSubmitting ? ".6" : "1" }}
      >
        <legend>from</legend>
        <input type="email" name="from" required autoFocus />
        <legend>subjet</legend>
        <input type="text" name="subject" required />
        <legend>text</legend>
        <input type="text" name="text" required />
        <input type="hidden" name="action" value="LOGIN" />

        <button type="submit" disabled={isSubmitting}>
          send
        </button>
        <ReCaptchaEnterprise
          siteKey={siteKey}
          action="LOGIN"
          onTokenChange={() => {}}
          onError={handleError}
        />
        <label>
          {isSubmitting ? fetcher.state : null}
          {showSuccessMessage ? <div>Your message has been sent</div> : null}
        </label>
      </fetcher.Form>
      {/* {fetcher.data ? <pre>{JSON.stringify(fetcher.data, null, 3)}</pre> : null} */}
    </main>
  );
}
