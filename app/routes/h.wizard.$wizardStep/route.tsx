import { useLoaderData } from "@remix-run/react";

import { WIZARD_STEP } from "~/constants";

import { action } from "./action.server";
import { loader } from "./loader.server";
import { PlansPage } from "./pages/PlansPage";
import { VerificationPage } from "./pages/VerificationPage";
import { ProfilePage } from "./pages/ProfilePage";

export { action, loader };

export default function WizardPage() {
  const data = useLoaderData<typeof loader>();
  switch (data.step) {
    case WIZARD_STEP.VERIFY:
      return <VerificationPage />;
    case WIZARD_STEP.PROFILE:
      return <ProfilePage {...data} />;
    case WIZARD_STEP.PLANS:
      return <PlansPage />;
    default:
      return null;
  }
}
