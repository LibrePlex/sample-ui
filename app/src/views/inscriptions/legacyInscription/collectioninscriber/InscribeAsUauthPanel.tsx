import { InscribeLegacyMetadataAsUauthTransactionButton } from "@app/components/legacyInscriptions/InscribeLegacyMetadataAsUauthTransactionButton";
import {
  ResizeLegacyMetadataAsUAuthTransactionButton,
  resizeLegacyInscription,
} from "@app/components/legacyInscriptions/ResizeLegacyInscriptionAsUAuthTransactionButton";
import { WriteToLegacyInscriptionAsUAuthTransactionButton, writeToLegacyInscriptionAsUauth } from "@app/components/legacyInscriptions/WriteToLegacyInscriptionAsUAuthTransactionButton";
import { ImageUploader } from "@app/components/shadowdrive/ImageUploader";
import { Button, HStack, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import {
  notify,
  useInscriptionForRoot,
  useLegacyCompressedImage,
  useMediaType,
  useOffChainMetadataCache,
} from "@libreplex/shared-ui";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { mediaTypeToString } from "shared-ui/src/components/inscriptionDisplay/useMediaType";
import { useOffchainImageAsBuffer } from "shared-ui/src/components/inscriptionDisplay/useOffchainImageAsBuffer";
import { useValidationHash } from "../../useValidationHash";
import { useLegacyInscriptionForMint } from "../useLegacyInscriptionForMint";
import { useInscriptionWriteStatus } from "@app/components/inscriptions/WriteToInscriptionTransactionButton";
import { useGenericTransactionClick } from "@libreplex/shared-ui";

enum Stage {
  NotStarted,
  UpdateTemplate,
  Resize,
  Write,
}

enum StageProgress {
  NotStarted,
  Progress,
  Success,
  Fail,
}

export const InscribeAsUauthPanel = ({ mint }: { mint: PublicKey }) => {
  const [customImage, setCustomImage] = useState<boolean>(true);

  const { data } = useOffChainMetadataCache(mint);

  const [imageOverride, setImageOverride] = useState<string>();

  const { data: imageBuffer, refetch } =
    useOffchainImageAsBuffer(imageOverride);

  const {
    inscription: { data: inscription },
  } = useInscriptionForRoot(mint);

  const sizeOk = useMemo(
    () => imageBuffer?.length === inscription?.item.size,
    [imageBuffer, inscription]
  );

  const {
    data: compressedImage,
    refetch: refetchOffchainData,
    isFetching: isFetchingOffchainData,
  } = useLegacyCompressedImage(mint);

  const sizeOkCompressed = useMemo(
    () => compressedImage?.buf.length === inscription?.item.size,
    [compressedImage, inscription]
  );

  // for now use the extension to figure out the subtype
  const mediaType = useMediaType(imageOverride ?? data?.images?.square);

  const legacyInscription = useLegacyInscriptionForMint(mint);

  const dataBytes = useMemo(
    () => (imageBuffer ? [...imageBuffer] : undefined),
    [imageBuffer]
  );
  const { reset } = useInscriptionWriteStatus(dataBytes, inscription?.pubkey);

  const [updateStatus, setUpdateStatus] = useState<{
    stage: Stage;
    result: StageProgress;
  }>({ stage: Stage.NotStarted, result: StageProgress.NotStarted });

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
      imageOverride && !sizeOk
    ) {
      setUpdateStatus({
        stage: Stage.Resize,
        result: StageProgress.Progress,
      });
      resizeClick();
    } else if(
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
        <HStack>
          <img
            style={{
              borderRadius: "15px",
              aspectRatio: "1/1",
              height: "100px",
            }}
            src={data?.images.square ?? ""}
          />
        </HStack>
        <VStack className="flex-col content-start">
          <Heading size="sms">Step 1/3: Initialise your inscription</Heading>
          {!inscription?.item && updateStatus.result !== StageProgress.Progress ? (
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

          {updateStatus.stage === Stage.Resize && updateStatus.result === StageProgress.Progress && <Spinner/>}
          {customImage && (
            <VStack>
              <ImageUploader
                currentImage={imageOverride}
                linkedAccountId={mint?.toBase58()}
                afterUpdate={(url) => {
                  // console.log({ url });
                  setImageOverride(url);
                  reset();
                  setUpdateStatus({
                    stage: Stage.UpdateTemplate,
                    result: StageProgress.Success,
                  });
                }}
              />

              {imageOverride && (
                <>
                  {" "}
                  <VStack>
                    {imageBuffer &&
                      imageBuffer.length !== inscription?.item.size && (
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
                </>
              )}
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
            </VStack>
          )}
        </VStack>
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
          {updateStatus.stage === Stage.Write && updateStatus.result === StageProgress.Progress && <Spinner/>}
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
