export enum ClientErrorType {
  BAD_REQUEST = "BAD_REQUEST",
  NOT_AUTHENTICATED = "NOT_AUTHENTICATED",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  PRODUCT_ERROR = "PRODUCT_ERROR",
}

export type BadRequestErrorData = {
  type: ClientErrorType.BAD_REQUEST;
};

export type NotAuthenticatedErrorData = {
  type: ClientErrorType.NOT_AUTHENTICATED;
};

export type PermissionDeniedErrorData = {
  type: ClientErrorType.PERMISSION_DENIED;
};

export type ProductErrorData = {
  type: ClientErrorType.PRODUCT_ERROR;
};

// If new client errors are needed, add them to this union
export type ClientErrorDataUnion =
  | BadRequestErrorData
  | NotAuthenticatedErrorData
  | PermissionDeniedErrorData
  | ProductErrorData;

export type ClientErrorData = ClientErrorDataUnion & {
  messages: string[];
};
