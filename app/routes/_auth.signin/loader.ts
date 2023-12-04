import { json } from "@remix-run/node";

export const loader = () => {
  return json({ clientId: process.env.GOOGLE_CLIENT_ID });
};
