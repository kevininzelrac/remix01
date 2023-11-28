import { ActionFunction, ActionFunctionArgs, redirect } from "@remix-run/node";
import { newUserSession } from "~/services/session.server";
import bcrypt from "bcryptjs";
import { serverContext as prisma } from "~/server";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const _newUser = await newUserSession.getSession(
    request.headers.get("Cookie")
  );
  const newUser = _newUser.get("newUser");
  const { code } = Object.fromEntries(await request.formData()) as {
    code: string;
  };

  const match = await bcrypt.compare(code, newUser.code);
  if (!match) throw new Error("Wooops Something Weird just happened !!");

  try {
    await prisma.userService.putNewUser(
      newUser.firstname,
      newUser.lastname,
      newUser.email,
      newUser.passwordHash
    );

    return redirect("/SignIn", {
      headers: {
        "Set-Cookie": await newUserSession.destroySession(newUser),
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Wooops, something weird just happened");
  }
};
