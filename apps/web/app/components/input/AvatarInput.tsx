import { Input, type InputProps } from "./Input";

export type AvatarInputProps = InputProps;

export function AvatarInput(props: AvatarInputProps) {
  return <Input {...props} type="file" />;
}
