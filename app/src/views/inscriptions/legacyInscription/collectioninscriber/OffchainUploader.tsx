import { useInscriptionWriteStatus } from "@app/components/inscriptions/WriteToInscriptionTransactionButton";
import { ImageUploader } from "@app/components/shadowdrive/ImageUploader";
import { VStack, Text } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useOffchainImageAsBuffer } from "shared-ui/src/components/inscriptionDisplay/useOffchainImageAsBuffer";
import {
  useFiletypeFromStream,
  useInscriptionV3ForRoot,
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
  } = useInscriptionV3ForRoot(mint);

  const { data } = useOffChainMetadataCache(mint);

  const { data: buf } = useOffchainImageAsBuffer(data?.images.url);
  const { data: filetype } = useFiletypeFromStream(data?.images.url);

  useEffect(() => {
    state.setImageOverride(data?.images.url);
    if (data?.images.url) {
      progressState.setUpdateStatus({
        stage: Stage.UpdateTemplate,
        result: StageProgress.Success,
      });
    }
  }, [data?.images]);

  const imageDisplay = useMemo(
    () =>
      state.filetype === "image/svg+xml"
        ? `data:image/svg+xml;base64,${encodeURIComponent(
            buf?.toString("base64") ?? ""
          )}`
        : state.imageOverride,
    [buf, state.filetype, state.imageOverride]
  );

  return (
    <VStack>
      <img
        style={{
          zIndex: 1,
          maxHeight: 200,
          maxWidth: 200,
          overflow: "hidden",
        }}
        height={"200px"}
        width={"200px"}
        src={imageDisplay}
      />
      
    </VStack>
  );
};
