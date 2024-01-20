import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import jwt from "jsonwebtoken";
import { userSession } from "~/services/session.server";

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    const user = await context.userService.getByEmailPasswordCombination(
      email,
      password,
    );

    const newUser = {
      id: user?.id,
      email: user?.email,
      firstname: user?.firstname,
      avatar: user?.avatar,
    };

    const refreshToken = jwt.sign(
      newUser,
      process.env.REFRESH_SECRET as string,
    );

    const verifiedRefresh = await context.userService.putRefreshToken(
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      user?.id!,
      refreshToken,
    );

    const accessToken = jwt.sign(newUser, process.env.ACCESS_SECRET as string, {
      expiresIn: process.env.ACCESS_TOKEN_DURATION,
    });

    const _user = await userSession.getSession(request.headers.get("Cookie"));
    _user.set("refreshToken", verifiedRefresh);
    _user.set("accessToken", accessToken);

    return redirect("/", {
      headers: {
        "Set-Cookie": await userSession.commitSession(_user),
      },
    });
  } catch (error) {
    console.error(error);
    return json({
      error: "Wooops Something Weird just happened !",
    });
  }
}
