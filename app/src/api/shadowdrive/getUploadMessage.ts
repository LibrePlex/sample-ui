import bs58 from "bs58";
import crypto from "crypto";
import nacl from "tweetnacl";
export const getUploadMessage = (
  storageAccountKey: string,
  filename: string,
  secretKey: Uint8Array
) => {
  const fileNameHashSum = crypto.createHash("sha256");
  fileNameHashSum.update(filename);
  const fileNameHash = fileNameHashSum.digest("hex");
  const msg = new TextEncoder().encode(
    `Shadow Drive Signed Message:\nStorage Account: ${storageAccountKey}\nUpload files with hash: ${fileNameHash}`
  );

  const messageSignature = nacl.sign.detached(msg, secretKey);

  return bs58.encode(messageSignature);
};
