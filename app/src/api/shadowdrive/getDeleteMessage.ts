import bs58 from "bs58";
import nacl from "tweetnacl";

export const getDeleteMessage = (
  shadowDriveStoreAccount: string,
  filename: string,
  secretKey: Uint8Array
) => {
  // console.log('DELETE', {filename, shadowDriveStoreAccount})
  const shadowDriveBaseUrl = "https://shdw-drive.genesysgo.net";
  const url = `${shadowDriveBaseUrl}/${shadowDriveStoreAccount}/${filename}`;
  // console.log({ url });
  const msg = Buffer.from(
    `Shadow Drive Signed Message:\nStorageAccount: ${shadowDriveStoreAccount}\nFile to delete: ${url}`
  );

  const messageSignature = nacl.sign.detached(msg, secretKey);

  return {
    signature: bs58.encode(messageSignature),
    url,
  };
};
