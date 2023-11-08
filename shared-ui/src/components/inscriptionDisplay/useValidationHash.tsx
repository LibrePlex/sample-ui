import crypto from "crypto";



import { useMemo } from "react";

export const calculateHashFromBuffer = (buf: Buffer) => {
  const webpHashSum = crypto.createHash("sha256");
  webpHashSum.update(buf);
  const webpHash = webpHashSum.digest("hex");
  return webpHash
}

export const useValidationHash = (buf: Buffer | undefined) => {
  return useMemo(() => (buf ? calculateHashFromBuffer(buf) : undefined), [buf]);
};
