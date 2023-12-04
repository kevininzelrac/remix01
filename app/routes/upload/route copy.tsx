// import {
//   ActionFunction,
//   ActionFunctionArgs,
//   json,
//   unstable_composeUploadHandlers as composeUploadHandlers,
//   unstable_createMemoryUploadHandler as createMemoryUploadHandler,
//   unstable_parseMultipartFormData as parseMultipartFormData,
// } from "@remix-run/node";
// import { useFetcher } from "@remix-run/react";

// const customUploadHandler = async (file: any) => {
//   if (file.name !== "file") return;
//   console.log(file);

//   return file.filename || "empty";
// };

// export let action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
//   try {
//     const uploadHandler = composeUploadHandlers(
//       customUploadHandler,
//       createMemoryUploadHandler()
//     );
//     const formData = await parseMultipartFormData(request, uploadHandler);

//     const filename = formData.get("file") as string;

//     return json(filename);
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };

// export default function Upload() {
//   const fetcher = useFetcher<typeof action>();

//   return (
//     <main>
//       <h2>Upload</h2>

//       <fetcher.Form method="post" encType="multipart/form-data">
//         <input type="file" name="file" accept="image/*" />
//         <button type="submit">Upload</button>
//       </fetcher.Form>
//       {fetcher.state}
//       {/* {fetcher.data ? <pre>{JSON.stringify(fetcher.data, null, 3)}</pre> : null} */}
//       {fetcher.data ? <img src={fetcher.data.url} /> : null}
//     </main>
//   );
// }
