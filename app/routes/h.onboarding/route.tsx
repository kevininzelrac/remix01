import { Form, useLoaderData } from "@remix-run/react";

import { loader } from "./loader";
import { Input, Label } from "~/components";

export { loader };

export default function OnboardingPage() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <Form method="POST">
      <div>
        <Label htmlFor="fullName"></Label>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={user.fullName ?? ""}
        />
      </div>
    </Form>
  );
}
