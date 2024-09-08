import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import type { IconProps } from "@radix-ui/react-icons/dist/types.js";

type EyeIconProps = IconProps &
  React.RefAttributes<SVGSVGElement> & {
    open?: boolean;
  };

export function EyeIcon({ open = true, ...props }: EyeIconProps) {
  return open ? <EyeOpenIcon {...props} /> : <EyeClosedIcon {...props} />;
}
