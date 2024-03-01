import { Form, useLoaderData } from "@remix-run/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { AvatarInput } from "~/components/input";

import { loader } from "./loader.server";
import { AssertionError } from "@app/utils/errors";

export { loader };
export { action } from "./action.server";

export default function ProfilePage() {
  const result = useLoaderData<typeof loader>();
  if (!result.success) {
    throw new AssertionError();
  }

  const {
    data: { user },
  } = result;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Form method="POST" encType="multipart/form-data">
        <Card className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
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
    </div>
  );
}
