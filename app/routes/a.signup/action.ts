import {
  ActionFunction,
  ActionFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import bcrypt from "bcryptjs";
import { newUserSession } from "~/services/session.server";
//import mail from "./mail";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const { firstname, lastname, email, password } = Object.fromEntries(
    await request.formData()
  ) as { firstname: string; lastname: string; email: string; password: string };

  const newUser = await newUserSession.getSession(
    request.headers.get("Cookie")
  );

  const code = verificationCode();

  newUser.set("newUser", {
    firstname,
    lastname,
    email,
    code: await bcrypt.hash(code, 10),
    passwordHash: await bcrypt.hash(password, 10),
  });

  try {
    //const sesClient = new SESClient({
    //  region: process.env.region,
    //});
    //await sesClient.send(new SendEmailCommand(mail(email, code)));
    return redirect("confirm", {
      headers: {
        "Set-Cookie": await newUserSession.commitSession(newUser),
      },
    });
  } catch (error) {
    console.error("Failed to send email : ", error);
    return json({
      success: false,
      error,
    });
  }
};

function verificationCode() {
  if (process.env.NODE_ENV === "production") {
    const code = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    return code.toString();
  } else {
    return "0000";
  }
}
