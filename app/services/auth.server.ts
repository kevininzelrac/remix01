import jwt, { JwtPayload } from "jsonwebtoken";
import { userSession } from "./session.server";
import { serverContext as prisma } from "~/server";

export type authType = {
  id: string;
  email: string;
  firstname: string;
  avatar: string;
  headers?: { "Set-Cookie": string };
};

export const auth = async (request: Request): Promise<authType> => {
  const user = await userSession.getSession(request.headers.get("Cookie"));
  const accessToken = user.get("accessToken");

  if (!accessToken) return await REDIRECT(user);

  const verifiedAccess = verifyToken(
    accessToken,
    process.env.ACCESS_SECRET as string
  );

  if (!verifiedAccess) {
    const verifiedRefresh = verifyToken(
      user.get("refreshToken"),
      process.env.REFRESH_SECRET as string
    );

    if (!verifiedRefresh) return await REDIRECT(user);

    const matchToken = await prisma.userService.getRefreshToken(
      verifiedRefresh.id,
      user.get("refreshToken")
    );

    if (!matchToken) return await REDIRECT(user);

    const verifiedMatch = verifyToken(
      matchToken,
      process.env.REFRESH_SECRET as string
    );

    if (!verifiedMatch) return await REDIRECT(user);

    const { id, email, firstname, avatar } = verifiedMatch;

    const newAccessToken = jwt.sign(
      { id, email, firstname, avatar },
      process.env.ACCESS_SECRET as string,
      { expiresIn: process.env.ACCESS_TOKEN_DURATION }
    );

    user.set("accessToken", newAccessToken);

    return {
      id,
      email,
      firstname,
      avatar,
      headers: {
        "Set-Cookie": await userSession.commitSession(user),
      },
    };
  }

  const { id, email, firstname, avatar } = verifiedAccess;

  return {
    id: id,
    email,
    firstname,
    avatar,
    headers: undefined,
  };
};

const REDIRECT = async (user: any) => {
  return {
    id: "",
    email: "",
    firstname: "",
    avatar: "",
    headers: {
      "Set-Cookie": await userSession.destroySession(user),
    },
  };
};

const verifyToken = (token: string, secret: string): JwtPayload | null => {
  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    return payload;
  } catch (error) {
    return null;
  }
};
