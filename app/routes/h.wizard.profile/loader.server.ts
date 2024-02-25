import { middleware } from "~/server/middleware";
import { authGuard } from "~/server/permissions";

export const loader = middleware.build(async (args) => {
  const { user } = await authGuard(args);

  return {
    user: {
      fullName: user.fullName,
      avatar: user.avatar,
    },
  };
});
