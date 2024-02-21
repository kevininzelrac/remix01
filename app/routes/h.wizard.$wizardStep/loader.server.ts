import type { User } from "@prisma/client";
import { redirect, json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";

import { PAGES, WIZARD_STEP } from "~/constants";
import type { TypedResponseData } from "~/server/types";

export const loader = async (args: LoaderFunctionArgs) => {
  const { request, context } = args;

  const userId = context.sessionService.getAuthenticatedUserId(request);
  if (!userId) {
    return redirect(PAGES.SIGN_IN);
  }

  const user = await context.userService.getById(userId);
  if (!user) {
    context.loggerService.error("Could not find user.", { userId });
    return redirect(PAGES.SIGN_OUT);
  }

  switch (user.wizardStep) {
    case WIZARD_STEP.INITIAL:
      return handleInitial(args, user);
    case WIZARD_STEP.VERIFY:
      return handleVerify(args, user);
    case WIZARD_STEP.PROFILE:
      return handleProfile(user);
    case WIZARD_STEP.PLANS:
      return handlePlans();
    case WIZARD_STEP.COMPLETE:
      return handleComplete();
    default:
      context.loggerService.error("Unexpected wizard step.", {
        step: user.wizardStep,
      });
      return redirect(PAGES.SIGN_OUT);
  }
};

const handleInitial = async ({ context }: LoaderFunctionArgs, user: User) => {
  const nextStep = user.emailVerifiedAt
    ? WIZARD_STEP.PROFILE
    : WIZARD_STEP.VERIFY;
  await context.userService.updateUser(user.id, {
    wizardStep: nextStep,
  });
  return redirect(PAGES.WIZARD(nextStep));
};

const handleVerify = ({ context }: LoaderFunctionArgs, user: User) => {
  context.sessionService.sendVerificationEmail(user);
  return json({
    step: WIZARD_STEP.VERIFY,
  });
};
export type VerifyProps = TypedResponseData<ReturnType<typeof handleVerify>>;

const handleProfile = (user: User) => {
  return json({
    step: WIZARD_STEP.PROFILE,
    user: {
      fullName: user.fullName,
      avatar: user.avatar,
    },
  });
};
export type ProfileProps = TypedResponseData<ReturnType<typeof handleProfile>>;

const handlePlans = () => {
  return json({
    step: WIZARD_STEP.PLANS,
  });
};
export type PlansProps = TypedResponseData<ReturnType<typeof handlePlans>>;

const handleComplete = () => {
  return redirect(PAGES.HOME);
};
