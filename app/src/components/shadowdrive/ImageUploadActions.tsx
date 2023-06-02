import { NEXT_PUBLIC_SHDW_ACCOUNT } from "@/environmentvariables";
import { HttpClient } from "HttpClient";
import { IShadowDriveUpload } from "api/shadowdrive/IShadowDriveUpload";
import { uploadImageToShadowDrive } from "api/shadowdrive/uploadToShadowDrive";
import { ReactNode, useCallback, useMemo, useState } from "react";
import Jimp from "jimp";
import { Button } from "@chakra-ui/react";

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
  return await httpClient.get<IShadowDriveUpload>(
    `/api/shadowdrive/upload/${mintId}/${fileExtension}`
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
  mintId,
  afterUpdate,
  notify,
}: { image: File } & {
  fileId: string;
  mintId: string;
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
      await uploadToShadowDrive(mintId, fileId, image);
    } catch (e) {
      console.log(e);
      notify({ message: "Could not upload to shadow drive", type: "error" });
    } finally {
      setProcessing(false);
    }
  }, [mintId, fileId, image]);

  return (
    <Button
      sx={{ width: "200px" }}
      disabled={processing}
      onClick={onClick}
      isLoading={false}
    >
      Upload
    </Button>
  );
};
