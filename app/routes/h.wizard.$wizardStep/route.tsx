import { Form, useLoaderData } from "@remix-run/react";

import { loader } from "./loader";
import { Input, Label } from "~/components";
import { WIZARD_STEP } from "~/constants";

export { loader };

// FIXME: IMPLEMENT UI BASED ON routes_old/h.onboarding
export default function OnboardingPage() {
  const data = useLoaderData<typeof loader>();
  if (data.step != WIZARD_STEP.PROFILE) return null;
  const { user } = data;
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
