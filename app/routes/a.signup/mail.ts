const mail = (email: string, code: string) => {
  return {
    Source: "verification@prisma.io",
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: "Band Manager Inscription - verification code",
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data:
            "<html><body><main>" +
            "<h1>Band Manager verification code</h1>" +
            "<p>" +
            email +
            "</p>" +
            "<p>" +
            code +
            "</p>" +
            "</main></body></html>",
        },
      },
    },
  };
};
export default mail;
