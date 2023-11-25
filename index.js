import { createRequestHandler } from "@remix-run/node";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const createRemixRequestHandler = ({
  build,
  getLoadContext,
  mode = process.env.NODE_ENV,
}) => {
  let handleRequest = createRequestHandler(build, mode);

  return awslambda.streamifyResponse(async (event, stream) => {
    let request = createRemixRequest(event);
    let loadContext = await getLoadContext?.(event);
    let response = await handleRequest(request, loadContext);

    await sendRemixResponse(response, stream);
  });
};

export const handler = createRemixRequestHandler({
  build: await import("./build/index.js"),
  getLoadContext: (event) => {
    return { hello: "world" };
  },
});

const createRemixRequest = (event) => {
  let method = event.requestContext.http.method;
  let host = event.headers["x-forwarded-host"] || event.headers.host;
  let search = event.rawQueryString.length ? `?${event.rawQueryString}` : "";
  let url = new URL(`https://${host}${event.rawPath}${search}`);
  console.log("URL ", url);

  let isFormData = event.headers["content-type"]?.includes(
    "multipart/form-data"
  );

  let controller = new AbortController();

  console.log("REQUEST ", event);

  return new Request(url.href, {
    method,
    headers: createRemixHeaders(event.headers, event.cookies),
    signal: controller.signal,
    body:
      event.body && event.isBase64Encoded
        ? isFormData
          ? Buffer.from(event.body, "base64")
          : Buffer.from(event.body, "base64").toString()
        : event.body,
  });
};

const createRemixHeaders = (requestHeaders, requestCookies) => {
  let headers = new Headers();
  for (let [header, value] of Object.entries(requestHeaders)) {
    if (value) headers.append(header, value);
  }
  if (requestCookies) headers.append("Cookie", requestCookies.join("; "));
  return headers;
};

const sendRemixResponse = async (response, responseStream) => {
  let cookies = [];
  for (let [key, value] of response.headers.entries()) {
    if (key.toLowerCase() === "set-cookie") cookies.push(value);
  }
  if (cookies.length) response.headers.delete("Set-Cookie");

  const contentType = response.headers.get("Content-Type");
  const isBase64Encoded = isBinaryType(contentType);

  const metadata = {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    cookies,
    isBase64Encoded,
  };
  console.log("RESPONSE ", response);
  console.log("METADATA ", metadata);

  responseStream = awslambda.HttpResponseStream.from(responseStream, metadata);

  await pipeline(
    response.body || Readable.from("Hello, World !"),
    responseStream
  );
};

const isBinaryType = (contentType) => {
  if (!contentType) return false;
  let [test] = contentType.split(";");
  return binaryTypes.includes(test);
};

const binaryTypes = [
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/avif",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "audio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
];

// export const handler = awslambda.streamifyResponse(
//   async (event, responseStream) => {
//     let handleRequest = createRequestHandler(
//       await import("./build/index.js"),
//       process.env.NODE_ENV
//     );

//     let request = createRemixRequest(event);
//     let getLoadContext = async (event) => {
//       //return { kevin: "says hi !", event: event };
//     };
//     let loadContext = await getLoadContext?.(event);

//     let response = await handleRequest(request, loadContext);
//     await sendRemixResponse(response, responseStream);
//   }
// );
