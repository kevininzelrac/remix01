import { Form, useLoaderData } from "@remix-run/react";

import type { ProfileProps, VerifyProps } from "./loader";
import { loader } from "./loader";
import {
  AvatarInput,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "~/components";
import { WIZARD_STEP } from "~/constants";
import { RESEND_CODE, SUBMIT_CODE } from "./action";

export { loader };

export default function OnboardingPage() {
  const data = useLoaderData<typeof loader>();
  switch (data.step) {
    case WIZARD_STEP.VERIFY:
      return <VerificationPage {...data} />;
    case WIZARD_STEP.PROFILE:
      return <ProfilePage {...data} />;
    default:
      return null;
  }
}

export function VerificationPage(data: VerifyProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Form
        method="POST"
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
      >
        <input type="hidden" value={SUBMIT_CODE} />
        <h2 className="text-3xl font-bold text-center">
          Enter Verification Code
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Please enter the 6-digit verification code we sent to your email.
        </p>
        <div className="flex justify-center">
          <Input
            id="code"
            name="code"
            className="text-center text-lg w-full"
            maxLength={6}
            placeholder="Enter code"
            type="text"
          />
        </div>
        <Button className="w-full">Verify</Button>
      </Form>
      <Form method="POST">
        <input type="hidden" value={RESEND_CODE} />
        <Button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground w-full">
          Resend Code
        </Button>
      </Form>
    </div>
  );
}

export function ProfilePage(data: ProfileProps) {
  const { user } = data;

  return (
    <Form className="flex flex-col gap-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your profile information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              defaultValue={user.fullName ?? ""}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="avatar">Avatar</Label>
            <AvatarInput
              id="avatar"
              name="avatar"
              defaultValue={user.avatar ?? ""}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto">Save</Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
