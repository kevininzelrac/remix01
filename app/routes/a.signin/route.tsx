import { Form, Link } from "@remix-run/react";

import { Label, Input, Button, PasswordInput } from "~/components";
import { OAuthMenu } from "~/components/auth";
import { pages } from "~/constants";

export { action } from "./action";

export default function SignInPage() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full md:w-1/2 p-8">
        <img
          alt="Sign In Illustration"
          className="object-cover w-full h-full rounded-lg shadow-md"
          height="500"
          src="/placeholder.svg"
          style={{
            aspectRatio: "500/500",
            objectFit: "cover",
          }}
          width="500"
        />
      </div>
      <div className="w-full md:w-1/2 p-8 space-y-6">
        <div className="flex flex-row justify-end items-center gap-3 mb-10">
          <p className="text-center text-gray-500">Don't have an account?</p>
          <Link to={pages.SIGN_UP}>
            <Button className="!bg-green-500 text-white">Sign Up</Button>
          </Link>
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-gray-500">
            Enter your information to sign in to your account
          </p>
        </div>
        <Form method="POST" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input name="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput name="password" required />
          </div>
          <Button className="w-full" type="submit">
            Sign In
          </Button>
        </Form>
        <div className="space-y-4">
          <p className="text-center text-gray-500">Or sign in with</p>
          <OAuthMenu />
        </div>
      </div>
    </div>
  );
}
