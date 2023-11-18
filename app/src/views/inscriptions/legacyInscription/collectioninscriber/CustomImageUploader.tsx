import { VStack } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useFiletypeFromStream, useOffchainImageAsBuffer } from "@libreplex/shared-ui";
import { useInscriptionForRoot } from "@libreplex/shared-ui";
import { IImageUploadProgressState, Stage, StageProgress } from "./useImageUploadProgressState";
import React from "react";
import { useInscriptionWriteStatus } from "../../../../components/inscriptions/WriteToInscriptionTransactionButton";
import { ImageUploader } from "../../../../components/shadowdrive/ImageUploader";
import { set } from "date-fns";

export interface IImageUploaderState {
  imageOverride: string | undefined;
  setImageOverride: Dispatch<SetStateAction<string | undefined>>;
  dataBytes: number[];
  filetype: string | undefined;
  imageBuffer: Buffer | undefined;
  refetch: () => any;
}

export const useImageUploaderState = (): IImageUploaderState => {
  const [imageOverride, setImageOverride] = useState<string>();

  const {data: buf }=
    useOffchainImageAsBuffer(imageOverride);

  const {data: filetype, refetch}=
    useFiletypeFromStream(imageOverride);

    useEffect(()=>{
      console.log({buf, filetype})
    },[buf, filetype])

  const dataBytes = useMemo(
    () => (buf ? [...buf] : undefined),
    [buf]
  );

  return { imageOverride, setImageOverride, imageBuffer: buf, refetch, dataBytes, filetype };
};

export const CustomImageUploader = ({
  mint,
  state,
  progressState
}: {
  mint: PublicKey;
  state: IImageUploaderState;
  progressState: IImageUploadProgressState;
}) => {
  const {
    inscription: { data: inscription },
  } = useInscriptionForRoot(mint);

  const { reset } = useInscriptionWriteStatus(
    state.dataBytes,
    inscription?.pubkey
  );

  return (
    <VStack>
      <ImageUploader
        currentImage={state.imageOverride}
        linkedAccountId={mint?.toBase58()}
        afterUpdate={(url) => {
          console.log({ url });
          state.setImageOverride(url);
          
          reset();
          progressState.setUpdateStatus({
            stage: Stage.UpdateTemplate,
            result: StageProgress.Success,
          });
        }}
      />

     
    </VStack>
  );
};
