import { middleware } from "~/server/middleware/index.js";
import { authGuard } from "~/server/permissions/authGuard.server.js";

export const loader = middleware.build(async (args) => {
  const { user } = await authGuard(args);

  return {
    user: {
      fullName: user.fullName,
      avatar: user.avatar,
    },
  };
});
