import { Button } from "~/components/button";
import { EyeIcon } from "~/components/icon";
import { Input } from "./Input";
import { useCallback, useState } from "react";

export type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visibility, setVisibility] = useState(false);

  const toggleVisibility = useCallback(() => {
    setVisibility((state) => !state);
  }, [setVisibility]);

  return (
    <div className={`relative w-full ${className}`}>
      <Input type={visibility ? "text" : "password"} {...props} />
      <Button
        className="absolute bottom-1 right-1 h-7 w-7 !bg-transparent !text-black !block"
        onClick={toggleVisibility}
      >
        <EyeIcon
          open={!visibility}
          className="h-5 w-5 absolute top-0.5 left-0.5"
        />
      </Button>
    </div>
  );
}
