import axios from "axios";
import crypto from "crypto";
import webp from "imagemin-webp";
import imagemin from "imagemin";
import { HttpClient, IOffchainJson } from "@libreplex/shared-ui";
import { Metadata } from "@metaplex-foundation/js";
import { useEffect, useState } from "react";

export const useWebpAndHash = (offchainUrl: string) => {
  const [buf, setBuf] = useState<Buffer>();
  const [hash, setHash] = useState<string>();

  useEffect(() => {
    let active = true;

    (async () => {
      const { webpHash, webpBuffer } = await convertToWebpAndHash(offchainUrl);

      active && setBuf(webpBuffer);
      active && setHash(webpHash);
    })();

    return () => {
      active = false;
    };
  }, [offchainUrl]);

  return { buf, hash };
};

export async function convertToWebpAndHash(offchainUrl: string) {
  const webpBuffer = await convertToWebp(offchainUrl);

  const webpHashSum = crypto.createHash("sha256");
  webpHashSum.update(webpBuffer);
  const webpHash = webpHashSum.digest("hex");
  return { webpHash, webpBuffer };
}

export async function convertToWebp(offchainurl: string) {
  // sanitize the damn thing
  const url = offchainurl.replace(/\0/g, "").trim();

  const httpClient = new HttpClient("");

  const httpClientBinary = new HttpClient("", { headers: {
    responseType: 'arraybuffer'
  } });

  const { data: offchainData } = await httpClient.get<IOffchainJson>(url);

  const offChainImage = await axios.request({
    responseType: 'arraybuffer',
    url: offchainData.image,
    method: 'get',
  }).then(result=>result.data);
    // console.log({offChainImage});
//   console.log({bufferlenbefore: ([...offChainImage as any]).length});
  const webpBuffer = (await imagemin.buffer(
    offChainImage as any,
    // Buffer.from([...(offChainImage as any)]),
    // "images",
    {
      plugins: [
        webp({
          quality: 10
        }),
      ],
    }
  ));
  return webpBuffer as Buffer;
}
