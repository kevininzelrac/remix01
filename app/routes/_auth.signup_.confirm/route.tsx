import { Form, useLoaderData } from "@remix-run/react";
import { type MetaFunction } from "@remix-run/node";

import { action } from "./action";
import { loader } from "./loader";
export { loader, action };

export const meta: MetaFunction = () => {
  return [
    { title: "Confirm Sign Up" },
    { name: "description", content: "Confirm Sign Up" },
  ];
};

export default function ConfirmSignUp() {
  const email = useLoaderData<typeof loader>();
  return (
    <>
      <Form method="post">
        <label>{email}</label>
        <input type="text" name="code" placeholder="verification code" />
        <button type="submit">Submit</button>
      </Form>
    </>
  );
}
