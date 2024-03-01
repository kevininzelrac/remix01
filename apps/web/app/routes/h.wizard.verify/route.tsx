import { Form } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { RESEND_CODE, SUBMIT_CODE } from "./constants";

export { action } from "./action.server";
export { loader } from "./loader.server";

export default function VerificationPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <Form method="POST">
          <input type="hidden" name="type" value={SUBMIT_CODE} />
          <h2 className="text-3xl font-bold text-center">
            Enter Verification Code
          </h2>
          <p className="text-gray-600 text-center">
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
          <Button type="submit" className="w-full mt-4">
            Verify
          </Button>
        </Form>
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="flex-shrink mx-4 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <Form method="POST">
          <input type="hidden" name="type" value={RESEND_CODE} />
          <Button type="submit" className="border border-input w-full">
            Resend Code
          </Button>
        </Form>
      </div>
    </div>
  );
}
