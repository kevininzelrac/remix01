import { ReactNode, useEffect, useState } from "react";

export default function ClientOnly({
  children,
}: {
  children: ReactNode;
}): ReactNode | null {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? children : null;
}
