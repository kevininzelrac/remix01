import { LoaderFunction, json } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  return json({ siteKey: process.env.RECAPTCHA_SITE_KEY });
};
