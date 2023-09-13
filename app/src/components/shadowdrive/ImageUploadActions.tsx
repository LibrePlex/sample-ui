import { NEXT_PUBLIC_SHDW_ACCOUNT } from "@app/environmentvariables";
import { HttpClient } from  "@libreplex/shared-ui";
import { IShadowDriveUpload } from "@app/api/shadowdrive/IShadowDriveUpload";
import { uploadImageToShadowDrive } from "@app/api/shadowdrive/uploadToShadowDrive";
import { ReactNode, useCallback, useMemo, useState } from "react";
import Jimp from "jimp";
import { Button } from "@chakra-ui/react";
import { WalletAuthenticatingButton } from  "@libreplex/shared-ui";

export interface IUpdatableMetadata {
  name: string;
  symbol: string;
  offchainUrl: string;
  creators: {
    address: string;
    share: number;
  }[];
}




function arrayBufferToBuffer(ab: ArrayBuffer) {
  var buffer = Buffer.alloc(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
  }
  return buffer;
}



export const getShadowDriveUploadSignature = async (
  mintId: string,
  fileExtension: string
) => {
  const httpClient = new HttpClient("");
  
  // TODO: Replace "DUMMYUPLOADTYPE" with metadata / collection etc
  // as validation will probably need to be performed serverside
  // as to who can upload what.
  // given this is a reference implementation, we haven't spent 
  // too much time on that, but if you're implementing this in 
  // production, you will want to check these things if you're
  // using shadowdrive / S3 or anything else where the keys are 
  // generated serverside.
  
  return await httpClient.get<IShadowDriveUpload>(
    `/api/shadowdrive/upload/DUMMYUPLOADTYPE/${mintId}/${fileExtension}`
  );
};




export const uploadToShadowDrive = async (
  mintId: string,
  fileId: string,
  imageFile: File
) => {
  const fileElems = fileId.split(".");
  const retval = await getShadowDriveUploadSignature(
    mintId,
    fileElems.length > 1 ? fileElems[fileElems.length - 1] : "png"
  );
  console.log({imageFile});

  const { data, error } = retval;
  // console.log({ data, error });
  if (!data || !imageFile) {
    return retval;
  }

  const buf = arrayBufferToBuffer(await imageFile.arrayBuffer());
  // const arrayBuf = await imageFile.arrayBuffer();
  // const jimpImage = await Jimp.read(Buffer.from(arrayBuf));
  // const imageBuffer = await jimpImage.getBufferAsync("image/png");

  // delete any old files

  // console.log({imageBuffer, mintId, data});
  await uploadImageToShadowDrive(
    NEXT_PUBLIC_SHDW_ACCOUNT,
    [...buf],
    data
  );
};

export const ImageUploadActions = ({
  image,
  children,
  fileId,
  linkedAccountId,
  afterUpdate,
  notify,
}: { image: File } & {
  fileId: string;
  linkedAccountId: string;
  children: ReactNode;
  afterUpdate?: (offchainUrl?: string) => any;
  notify: (newNotification: {
    type?: string;
    message: string;
    description?: string;
    txid?: string;
  }) => void;
}) => {
  const [processing, setProcessing] = useState<boolean>(false);

  const onClick = useCallback(async () => {
    try {
      setProcessing(true);
      const retval = await uploadToShadowDrive(linkedAccountId, fileId, image);
      afterUpdate()
      return retval;
    } catch (e) {
      console.log(e);
      notify({ message: "Could not upload to shadow drive", type: "error" });
      
    } finally {
      setProcessing(false);
    }
  }, [linkedAccountId, fileId, image, afterUpdate, notify]);

  return (
    <WalletAuthenticatingButton
      disabled={processing}
      onClick={onClick}
      isLoading={false}
    >
      Update
    </WalletAuthenticatingButton>
  );
};
