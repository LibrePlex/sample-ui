import { NEXT_PUBLIC_SHDW_ACCOUNT, SHDW_DRIVE_OWNER_SECRET_KEY } from '@app/environmentvariables';

import { Connection, Keypair } from "@solana/web3.js";
import { defaultAuthenticatedHandler } from '@app/api/middleware/authenticatedWallet';
import { SystemUser, WalletUser } from '@app/api/middleware/validateAuthenticatedWallet';

import { IShadowDriveUpload } from "@app/api/shadowdrive/IShadowDriveUpload";
import { getDeleteMessage } from "@app/api/shadowdrive/getDeleteMessage";
import { getUploadMessage } from "@app/api/shadowdrive/getUploadMessage";



import { NextApiRequest, NextApiResponse } from "next";
import { ApiErrors } from "@app/pages/api/ApiErrors";

export const createMintUrlUploadMessage = async (
  req: NextApiRequest,
  res: NextApiResponse,
   user: WalletUser | SystemUser
) => {
  const { mintId, ext } = req.query as {
    mintId: string;
    ext: string;
    // uploadType: string;
    
  };

  // TODO: Perform appropriate checks to prevent people from uploading random jump
  /* 
    
    For example, check that wallet has the edit permission on a collection / mint etc.
    For now, we require that the wallet is authenticated but no such checks are performed.

  */

  try {
    console.log(mintId);
    
    let bucket = NEXT_PUBLIC_SHDW_ACCOUNT;

    let fileId: string | undefined;

    console.log({ fileId, ext });
    const keyArray = new Uint8Array(JSON.parse(SHDW_DRIVE_OWNER_SECRET_KEY));

    const keyPair = Keypair.fromSecretKey(keyArray);

    const filename = `${mintId}.${ext}`;
    console.log({filename});
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

    console.log("Response ", resp);
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

export default defaultAuthenticatedHandler(createMintUrlUploadMessage);
