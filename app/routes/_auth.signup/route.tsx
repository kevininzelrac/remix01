import { Form } from "@remix-run/react";

import { action } from "./action";
export { action };

import "./style.css";

import { type MetaFunction } from "@remix-run/node";
import { SetStateAction, useState } from "react";
export const meta: MetaFunction = () => {
  return [{ title: "Sign Up" }, { name: "description", content: "Sign Up" }];
};

export default function SignUp() {
  const [password, setPassword] = useState<SetStateAction<string>>("");
  const [confirm, setConfirm] = useState<SetStateAction<string>>("");
  const border =
    password === ""
      ? {}
      : password === confirm
        ? { borderBottom: "3px solid green" }
        : { borderBottom: "3px solid crimson" };

  return (
    <main>
      <Form method="post">
        <input type="text" name="firstname" placeholder="firstname" />
        <input type="text" name="lastname" placeholder="lastname" />
        <input type="email" name="email" placeholder="email" />
        <input
          type="password"
          name="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          style={border}
        />
        <input
          type="confirm"
          name="confirm"
          placeholder="confirm"
          onChange={(e) => setConfirm(e.target.value)}
          style={border}
        />

        <button
          type="submit"
          disabled={password === "" || confirm === "" || password !== confirm}
          style={{ opacity: password === confirm ? "1" : ".6" }}
        >
          submit
        </button>
      </Form>
    </main>
  );
}
