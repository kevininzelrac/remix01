import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { userSession } from "~/services/session.server";

const googleClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
});

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const accessToken = formData.get("accessToken") as string;

  const verifiedToken = await googleClient.verifyIdToken({
    idToken: accessToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { sub, email, given_name, family_name, picture }: any =
    verifiedToken.getPayload();

  try {
    const googleUser = await context.userService.signGoogleUser(
      sub,
      email,
      given_name,
      family_name,
      picture,
    );

    const newUser = {
      id: googleUser!.id,
      email: googleUser!.email,
      firstname: googleUser!.firstname,
      avatar: googleUser!.avatar,
    };

    const refreshToken = jwt.sign(
      newUser,
      process.env.REFRESH_SECRET as string,
    );

    const verifiedRefresh = await context.userService.putRefreshToken(
      googleUser!.id,
      refreshToken,
    );

    const accessToken = jwt.sign(newUser, process.env.ACCESS_SECRET as string, {
      expiresIn: process.env.ACCESS_TOKEN_DURATION,
    });

    const user = await userSession.getSession(request.headers.get("Cookie"));
    user.set("refreshToken", verifiedRefresh);
    user.set("accessToken", accessToken);

    return redirect("/", {
      headers: {
        "Set-Cookie": await userSession.commitSession(user),
      },
    });
  } catch (error) {
    console.log(error);
    return json({
      error: "Wooops Something Weird just happened !",
    });
  }
};
