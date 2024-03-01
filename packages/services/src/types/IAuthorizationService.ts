import { Awaitable } from "@app/utils/types";

export enum PermissionType {
  ADD_PORTAFOLIO = "ADD_PORTAFOLIO",
  ADD_PICTURE = "ADD_PICTURE",
  EDIT_PICTURE = "EDIT_PICTURE",
  DELETE_PICTURE = "DELETE_PICTURE",
  HIDE_BRANDING = "HIDE_BRANDING",
}

type Variant<I, O> = { input: I; output: O };

/* eslint-disable prettier/prettier */
export type PermissionVariants<P extends PermissionType> =
  P extends PermissionType.ADD_PORTAFOLIO ?
    Variant<
      Record<string, never>,
      { enabled: boolean }
    > :
  P extends PermissionType.ADD_PICTURE ?
    Variant<
      Record<string, never>,
      { enabled: boolean }
    > :
  P extends PermissionType.EDIT_PICTURE ?
    Variant<
      { pictureId: string },
      { enabled: boolean }
    > :
  P extends PermissionType.DELETE_PICTURE ?
    Variant<
      { pictureId: string },
      { enabled: boolean }
    > :
  P extends PermissionType.HIDE_BRANDING ?
    Variant<
      { portafolioId: string },
      { enabled: boolean }
    > :
  never;
/* eslint-enable prettier/prettier */

export interface IAuthorizationService {
  getUserPermission<P extends PermissionType>(
    userId: string | null,
    type: P,
    query: PermissionVariants<P>["input"],
  ): Awaitable<PermissionVariants<P>["output"]>;
}
