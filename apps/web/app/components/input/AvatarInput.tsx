import { Input, type InputProps } from "~/components/ui/input.js";

export type AvatarInputProps = InputProps;

export function AvatarInput(props: AvatarInputProps) {
  return <Input {...props} type="file" />;
}
