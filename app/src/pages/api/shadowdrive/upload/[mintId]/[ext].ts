import { NEXT_PUBLIC_SHDW_ACCOUNT, SHDW_DRIVE_OWNER_SECRET_KEY } from '@/environmentvariables';

import { Connection, Keypair } from "@solana/web3.js";

import { IShadowDriveUpload } from "api/shadowdrive/IShadowDriveUpload";
import { getDeleteMessage } from "api/shadowdrive/getDeleteMessage";
import { getUploadMessage } from "api/shadowdrive/getUploadMessage";



import { NextApiRequest, NextApiResponse } from "next";
import { ApiErrors } from "pages/api/ApiErrors";

export const createCollectionUploadMessage = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const { mintId, ext } = req.query as {
    mintId: string;
    ext: string;
  };

  try {
    console.log(mintId);
    
    let bucket = NEXT_PUBLIC_SHDW_ACCOUNT;

    let fileId: string | undefined;

    console.log({ fileId, ext });
    const keyArray = new Uint8Array(JSON.parse(SHDW_DRIVE_OWNER_SECRET_KEY));

    const keyPair = Keypair.fromSecretKey(keyArray);

    const filename = `${mintId}.${ext}`;
    const messageSignatureUpload = getUploadMessage(
      bucket, //keyPair.publicKey.toBase58(),
      filename,
      keyArray
    );

    const messageSignatureDelete = getDeleteMessage(bucket, filename, keyArray);

    const resp = {
      upload: {
        signature: messageSignatureUpload,
        filename,
      },
      delete: messageSignatureDelete,
      signer: keyPair.publicKey.toBase58(),
    } as IShadowDriveUpload;

    console.log("Response ");
    return res.status(200).json(resp);
  } catch (e) {
    console.log(e);
    return res.status(403).json({
      message: "Authentication failed",
      code: ApiErrors.FORBIDDEN,
    });
  }
};

export const errorHandler = (
  handler: (req: NextApiRequest, res: NextApiResponse) => any
) => {
  return (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return handler(req, res);
    } catch (e) {
      res.status(500).json({
        message: (e as Error).message,
        code: ApiErrors.EXECUTION_FAILED,
      });
    }
  };
};

export default createCollectionUploadMessage;
