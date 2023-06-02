import NodeFormData from "form-data";

import fetch from "cross-fetch";

import { IShadowDriveUpload } from "./IShadowDriveUpload";

export const uploadImageToShadowDrive = async (
  shadowDriveAccount: string,
  imageBuffer: number[],
  config: IShadowDriveUpload
) => {
  const pngFileBuffer = Buffer.from(imageBuffer);
  const isBrowser = new Function(
    "try {return this===window;}catch(e){ return false;}"
  )();

  let form: any;
  let fileBuffer: any;
  let file: any;
  try {
    if (!isBrowser) {
      form = new NodeFormData();
      file = pngFileBuffer;
      form.append("file", file, config.upload.filename);
      fileBuffer = file;
    } else {
      file = new File([new Blob([pngFileBuffer])], config?.upload.filename, {
        type: "image/png",
      });
      form = new FormData();
      form.append("file", file, config?.upload.filename);
      fileBuffer = Buffer.from(new Uint8Array(await file.arrayBuffer()));
    }

    if (fileBuffer.byteLength > 10_485_760) {
      throw Error("File too large (max 10 MB)");
    }

    // await deleteFromShadowDrive(
    //   config.signer,
    //   config.delete.url,
    //   config.delete.signature
    // );
  } catch (e) {
    // console.log(e);
  }

  form.append("fileNames", config.upload.filename);
  form.append("message", config.upload.signature);
  form.append("storage_account", shadowDriveAccount);
  form.append("signer", config.signer);
  form.append("overwrite", "true");

  const shadowDriveEndpoint = "https://shadow-storage.genesysgo.net";

  // console.log({shadowDriveEndpoint, shadowDriveAccount})
  // const httpClient = new HttpClient(`${shadowDriveEndpoint}/upload`);
  const uploadResponse = await fetch(`${shadowDriveEndpoint}/upload`, {
    method: "POST",
    body: form,
  });
  // console.log({ uploadResponse: await uploadResponse.json() });
  if (!uploadResponse.ok) {
    return Promise.reject(
      new Error(`Server response status code: ${uploadResponse.status} \n
                      Server response status message: ${
                        (await uploadResponse.json()).error
                      }`)
    );
  }

  return pngFileBuffer.toString("base64");
};
