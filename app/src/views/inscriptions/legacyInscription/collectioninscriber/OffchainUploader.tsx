import { useInscriptionWriteStatus } from "@app/components/inscriptions/WriteToInscriptionTransactionButton";
import { ImageUploader } from "@app/components/shadowdrive/ImageUploader";
import { VStack } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useOffchainImageAsBuffer } from "shared-ui/src/components/inscriptionDisplay/useOffchainImageAsBuffer";
import {
  useInscriptionForRoot,
  useOffChainMetadataCache,
} from "@libreplex/shared-ui";
import {
  IImageUploadProgressState,
  Stage,
  StageProgress,
} from "./useImageUploadProgressState";
import { IImageUploaderState } from "./CustomImageUploader";

export const OffchainUploader = ({
  mint,
  state,
  progressState,
}: {
  mint: PublicKey;
  state: IImageUploaderState;
  progressState: IImageUploadProgressState;
}) => {
  const {
    inscription: { data: inscription },
  } = useInscriptionForRoot(mint);

  const { data } = useOffChainMetadataCache(mint);

  useEffect(() => {
    state.setImageOverride(data.images.url);
    if( data.images.url) {
      progressState.setUpdateStatus({
        stage: Stage.UpdateTemplate,
        result: StageProgress.Success,
      });
    }
  }, [data.images]);

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  return (
    <img
    onLoadStart={() => {
      setImageLoaded(false);
    }}
    onLoad={() => {
      setImageLoaded(true);
    }}
    style={{
      zIndex: 1,
      opacity: imageLoaded ? 1 : 0,
      maxHeight: 200,
      maxWidth: 200,
      overflow: "hidden",
    }}
    height={"200px"}
    width={"200px"}
    src={state.imageOverride}
  />
  );
};
