import { useAsyncError } from "@remix-run/react";

export default function ErrorElement() {
  const error: any = useAsyncError();
  return <p style={{ color: "crimson" }}>{error.message}</p>;
}
