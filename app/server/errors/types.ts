export enum ClientErrorType {
  BAD_REQUEST = "BAD_REQUEST",
}

export type BadRequestErrorData = {
  type: typeof ClientErrorType.BAD_REQUEST;
};

// If new client errors are needed, add them to this union
export type ClientErrorDataUnion = BadRequestErrorData;

export type ClientErrorData = ClientErrorDataUnion & {
  messages: string[];
};
