import { useInscriptionWriteStatus } from "@app/components/inscriptions/WriteToInscriptionTransactionButton";
import { ImageUploader } from "@app/components/shadowdrive/ImageUploader";
import { VStack } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useOffchainImageAsBuffer } from "shared-ui/src/components/inscriptionDisplay/useOffchainImageAsBuffer";
import { useInscriptionForRoot } from "@libreplex/shared-ui";
import { IImageUploadProgressState, Stage, StageProgress } from "./useImageUploadProgressState";

export interface IImageUploaderState {
  imageOverride: string;
  setImageOverride: Dispatch<SetStateAction<string>>;
  dataBytes: number[];
  imageBuffer: Buffer;
  refetch: () => any;
}

export const useImageUploaderState = (): IImageUploaderState => {
  const [imageOverride, setImageOverride] = useState<string>();

  const { data: imageBuffer, refetch } =
    useOffchainImageAsBuffer(imageOverride);

  const dataBytes = useMemo(
    () => (imageBuffer ? [...imageBuffer] : undefined),
    [imageBuffer]
  );

  return { imageOverride, setImageOverride, imageBuffer, refetch, dataBytes };
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
          // console.log({ url });
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
