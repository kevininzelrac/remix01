import { ActionFunction, ActionFunctionArgs, json } from "@remix-run/node";
import gmail from "~/services/gmail.server";
import reCaptcha from "~/services/reCaptcha.server";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const from = formData.get("from") as string;
  const subject = formData.get("subject") as string;
  const text = formData.get("text") as string;
  const token = formData.get("token") as string;
  const action = formData.get("action") as string;

  await reCaptcha({ token, action });

  const response = await gmail.sendMail({
    from: '"ShedSync - Band Manager" <shedsync@gmail.com>',
    to: "shedsync@gmail.com",
    subject: subject,
    //text: text,
    html: "<h2>" + from + "</h2>" + "<p>" + text + "</p>",
  });

  return json({ response });
};
