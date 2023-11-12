import axios from "axios";

import webp from "imagemin-webp";
import imagemin from "imagemin";
import { HttpClient, IOffchainJson, getImageAsBuffer } from "@libreplex/shared-ui";
import { Metadata } from "@metaplex-foundation/js";
import { useEffect, useState } from "react";
import { calculateHashFromBuffer } from "./calculateHashFromBuffer";


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

  const webpHash = calculateHashFromBuffer(webpBuffer);
  return { webpHash, webpBuffer };
}

export async function convertToWebp(offchainurl: string) {
  // sanitize the damn thing
  const url = offchainurl.replace(/\0/g, "").trim();

  const httpClient = new HttpClient("");
  const { data: offchainData } = await httpClient.get<IOffchainJson>(url);

  const webBuffer = await compressAndConvert(
    await getImageAsBuffer(offchainData.image)
  );
  return webBuffer as Buffer;
}



export const compressAndConvert = async (offChainImage: ArrayBuffer) => {
  const webpBuffer = await imagemin.buffer(
    offChainImage,
    // Buffer.from([...(offChainImage as any)]),
    // "images",
    {
      plugins: [
        webp({
          quality: 10,
        }),
      ],
    }
  );
  return webpBuffer;
};
