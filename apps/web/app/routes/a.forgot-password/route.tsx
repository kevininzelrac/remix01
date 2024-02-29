import { Form } from "@remix-run/react";

import { useSearchParams } from "@remix-run/react";

import { Button, Input, PasswordInput } from "~/components";
import { ActionType } from "./constants";

export { action } from "./action.server";

export default function ForgotPasswordPage() {
  const [searchParams] = useSearchParams();

  const code = searchParams.get("code");
  if (code) {
    return <ResetPasswordView code={code} />;
  } else {
    return <SubmitEmailView />;
  }
}

function SubmitEmailView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <Form method="POST">
          <input type="hidden" name="type" value={ActionType.SUBMIT_EMAIL} />
          <h2 className="text-3xl font-bold text-center">Enter your email</h2>
          <p className="text-gray-600 text-center">
            If you have signed up with us we will send you an email so you can
            reset your password
          </p>
          <div className="flex justify-center">
            <Input
              id="email"
              name="email"
              className="text-center text-lg w-full"
              placeholder="Email"
              type="email"
            />
          </div>
          <Button type="submit" className="w-full mt-4">
            Send
          </Button>
        </Form>
      </div>
    </div>
  );
}

type ResetPasswordViewProps = {
  code: string;
};

function ResetPasswordView({ code }: ResetPasswordViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <Form method="POST">
          <input type="hidden" name="type" value={ActionType.RESET_PASSWORD} />
          <input type="hidden" name="code" value={code} />
          <h2 className="text-3xl font-bold text-center">Reset Password</h2>
          <p className="text-gray-600 text-center">Create a new password</p>
          <div className="flex justify-center flex-col">
            <PasswordInput
              id="password"
              name="password"
              className="text-center text-lg w-full mt-4"
              placeholder="Password"
            />
            <PasswordInput
              id="verifyPassword"
              name="verifyPassword"
              className="text-center text-lg w-full mt-4"
              placeholder="Verify Password"
            />
          </div>
          <Button type="submit" className="w-full mt-4">
            Reset password
          </Button>
        </Form>
      </div>
    </div>
  );
}
