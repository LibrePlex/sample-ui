import { InscribeLegacyMetadataAsUauthTransactionButton } from "@app/components/legacyInscriptions/InscribeLegacyMetadataAsUauthTransactionButton";
import {
  ResizeLegacyMetadataAsUAuthTransactionButton,
  resizeLegacyInscription,
} from "@app/components/legacyInscriptions/ResizeLegacyInscriptionAsUAuthTransactionButton";
import {
  WriteToLegacyInscriptionAsUAuthTransactionButton,
  writeToLegacyInscriptionAsUauth,
} from "@app/components/legacyInscriptions/WriteToLegacyInscriptionAsUAuthTransactionButton";
import {
  HStack,
  Heading,
  Link,
  Spinner,
  Text,
  VStack
} from "@chakra-ui/react";
import {
  notify,
  useGenericTransactionClick,
  useInscriptionForRoot,
  useLegacyCompressedImage,
  useMediaType
} from "@libreplex/shared-ui";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { mediaTypeToString } from "shared-ui/src/components/inscriptionDisplay/useMediaType";
import { useLegacyInscriptionForMint } from "../useLegacyInscriptionForMint";
import {
  useImageUploaderState
} from "./CustomImageUploader";
import {
  ImageSourceSelector
} from "./ImageSourceSelector";
import {
  Stage,
  StageProgress,
  useImageUploadProgressState,
} from "./useImageUploadProgressState";

export const InscribeAsUauthPanel = ({ mint }: { mint: PublicKey }) => {
  const [customImage, setCustomImage] = useState<boolean>(true);

  const {
    inscription: { data: inscription },
  } = useInscriptionForRoot(mint);

  const {
    data: compressedImage,
    refetch: refetchOffchainData,
    isFetching: isFetchingOffchainData,
  } = useLegacyCompressedImage(mint);

  const sizeOkCompressed = useMemo(
    () => compressedImage?.buf.length === inscription?.item.size,
    [compressedImage, inscription]
  );

  const legacyInscription = useLegacyInscriptionForMint(mint);

  const uploaderState = useImageUploaderState();

  const { imageBuffer, imageOverride, dataBytes } = uploaderState;

  const sizeOk = useMemo(
    () => imageBuffer?.length === inscription?.item.size,
    [imageBuffer, inscription]
  );

  // for now use the extension to figure out the subtype
  const mediaType = useMediaType(imageOverride);

  const { updateStatus, setUpdateStatus } = useImageUploadProgressState();

  const { onClick: resizeClick, isExecuting: isExecutingResize } =
    useGenericTransactionClick({
      params: {
        mint,
        targetSize: imageBuffer?.length,
        currentSize: inscription?.item.size,
      },
      beforeClick: undefined,
      transactionGenerator: resizeLegacyInscription,
      onSuccess: () => {
        setUpdateStatus({
          stage: Stage.Resize,
          result: StageProgress.Success,
        });
      },
      onError: (e) => {
        // console.log({ e });
        notify({ type: "error", message: "Resizing inscription failed" });
        setUpdateStatus({
          stage: Stage.Resize,
          result: StageProgress.Fail,
        });
      },
      afterSign: () => {
        setUpdateStatus({
          stage: Stage.Resize,
          result: StageProgress.Progress,
        });
      },
    });

  const { onClick: writeClick, isExecuting: isExecutingWrite } =
    useGenericTransactionClick({
      params: {
        mint,
        dataBytes,
        encodingType: { base64: {} },
        mediaType,
      },
      beforeClick: undefined,
      transactionGenerator: writeToLegacyInscriptionAsUauth,
      onSuccess: () => {
        setUpdateStatus({
          stage: Stage.Write,
          result: StageProgress.Success,
        });
      },
      onError: (e) => {
        // console.log({ e });
        notify({ type: "error", message: "Write inscription failed" });
        setUpdateStatus({
          stage: Stage.Write,
          result: StageProgress.Fail,
        });
      },
      afterSign: () => {
        setUpdateStatus({
          stage: Stage.Write,
          result: StageProgress.Progress,
        });
      },
    });

  // stage transitions

  // when updatestatus === UpdateSuccess *and* we have an imageOverride, move to Resizing state and simulate resize click
  useEffect(() => {
    // console.log({updateStatus, imageOverride, sizeOk, dataBytes});
    if (
      updateStatus.stage === Stage.UpdateTemplate &&
      updateStatus.result === StageProgress.Success &&
      imageOverride &&
      !sizeOk
    ) {
      setUpdateStatus({
        stage: Stage.Resize,
        result: StageProgress.Progress,
      });
      resizeClick();
    } else if (
      updateStatus.result === StageProgress.Success &&
      updateStatus.stage !== Stage.Write &&
      sizeOk &&
      dataBytes
    ) {
      setUpdateStatus({
        stage: Stage.Write,
        result: StageProgress.Progress,
      });
      writeClick();
    }
  }, [updateStatus, imageOverride, sizeOk, dataBytes]);

  const progressState = useImageUploadProgressState();

  return (
    <VStack>
      {/* <Heading pt={2} size="md">
        Inscribing as Update Authority
      </Heading> */}

      {legacyInscription?.item.authorityType.updateAuthority && (
        <Text>
          As the update authority on this mint, you can either inscribe the
          offchain image or optionally override and inscribe any image you want,
          such as custom pixel art.
        </Text>
      )}
      {legacyInscription?.item.authorityType.holder && (
        <Text>
          Uh oh - looks like the holder inscribed this item first. As the update
          auth holder, there is a mechanism for you to kick them and replace the
          inscription with your own. It is being worked on at the moment by the
          LibrePlex team. Pop over to the discord to find out more.
        </Text>
      )}

      <HStack
        className="border-2 rounded-md border-inherit w-full"
        p={3}
        gap={5}
      >
        <VStack className="flex-col content-start">
          <Heading size="sms">Step 1/3: Initialise your inscription</Heading>
          {!inscription?.item &&
          updateStatus.result !== StageProgress.Progress ? (
            <InscribeLegacyMetadataAsUauthTransactionButton
              params={{
                mint,
                imageOverride: undefined,
              }}
              formatting={{}}
            />
          ) : (
            <HStack className="content-start">
              <HiCheckCircle color="lightgreen" size={"35px"} />
              <Heading size="sm">Initialised</Heading>
            </HStack>
          )}
        </VStack>
      </HStack>

      {inscription && (
        <VStack
          className="border-2 rounded-md border-inherit w-full"
          p={3}
          m={1}
          gap={5}
        >
          <Heading pt={2} size="sm">
            Step 2/3: Choose source & resize
          </Heading>
          <ImageSourceSelector
            mint={mint}
            allowCustom={true}
            state={uploaderState}
            progressState={progressState}
          />

          {updateStatus.stage === Stage.Resize &&
            updateStatus.result === StageProgress.Progress && <Spinner />}
        </VStack>
      )}

      <VStack>
        <Text>Buffer length: {imageBuffer?.length}</Text>
        <Link href={imageOverride} target="_blank">
          View original
        </Link>
        {imageBuffer && !sizeOk && (
          <ResizeLegacyMetadataAsUAuthTransactionButton
            params={{
              mint,
              targetSize: imageBuffer.length,
              currentSize: inscription?.item.size,
            }}
            formatting={{}}
          />
        )}
      </VStack>
      {sizeOk && imageBuffer ? (
        <HStack>
          <HiCheckCircle color="lightgreen" size="35px" />
          <Heading size="sm">
            SIZE CHECK: {inscription?.item?.size} bytes
          </Heading>
        </HStack>
      ) : (
        <HStack>
          <HiXCircle color="#f66" size={"50px"} />
          <Text>
            Image sizes do not match. Current inscription size:{" "}
            {inscription?.item.size}, need: {imageBuffer?.length}
          </Text>
        </HStack>
      )}
      {inscription && sizeOk ? (
        <VStack
          className="border-2 rounded-md border-inherit w-full"
          p={3}
          m={1}
          gap={5}
        >
          <Heading pt={2} size="sm">
            Step 3/3: Inscribe
          </Heading>
          {updateStatus.stage === Stage.Write &&
            updateStatus.result === StageProgress.Progress && <Spinner />}
          {dataBytes && (
            <WriteToLegacyInscriptionAsUAuthTransactionButton
              params={{
                mint,
                dataBytes,
                encodingType: { base64: {} },
                mediaType,
              }}
              formatting={{}}
            />
          )}
          {mediaTypeToString(mediaType)}
        </VStack>
      ) : (
        <></>
      )}
    </VStack>
  );
};
