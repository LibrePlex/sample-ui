import { InscribeLegacyMetadataAsUauthTransactionButton } from "@app/components/legacyInscriptions/InscribeLegacyMetadataAsUauthTransactionButton";
import { ResizeLegacyMetadataAsUAuthTransactionButton } from "@app/components/legacyInscriptions/ResizeLegacyInscriptionAsUAuthTransactionButton";
import { WriteToLegacyInscriptionAsUAuthTransactionButton } from "@app/components/legacyInscriptions/WriteToLegacyInscriptionAsUAuthTransactionButton";
import { ImageUploader } from "@app/components/shadowdrive/ImageUploader";
import { Button, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import {
  useInscriptionForRoot,
  useLegacyCompressedImage,
  useMediaType,
  useOffChainMetadataCache,
} from "@libreplex/shared-ui";
import { PublicKey } from "@solana/web3.js";
import { useMemo, useState } from "react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { mediaTypeToString } from "shared-ui/src/components/inscriptionDisplay/useMediaType";
import { useOffchainImageAsBuffer } from "shared-ui/src/components/inscriptionDisplay/useOffchainImageAsBuffer";
import { useValidationHash } from "../../useValidationHash";
import { useLegacyInscriptionForMint } from "../useLegacyInscriptionForMint";
import { useInscriptionWriteStatus } from "@app/components/inscriptions/WriteToInscriptionTransactionButton";

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
      <VStack p={5} gap={5}>
        <img
          style={{ borderRadius: "15px", aspectRatio: "1/1", height: "100px" }}
          src={data?.images.square ?? ""}
        />
      </VStack>
      <VStack
        className="border-2 rounded-md border-inherit w-full"
        p={3}
        gap={5}
      >
        <Heading size="sms">Step 1/3: Initialise your inscription</Heading>
        {!inscription?.item ? (
          <InscribeLegacyMetadataAsUauthTransactionButton
            params={{
              mint,
              imageOverride: undefined,
            }}
            formatting={{}}
          />
        ) : (
          <HStack>
            <HiCheckCircle color="lightgreen" size={"35px"} />
            <Heading size="sm">Initialised</Heading>
          </HStack>
        )}
      </VStack>

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

          {customImage && (
            <VStack>
              <ImageUploader
                currentImage={imageOverride}
                linkedAccountId={mint?.toBase58()}
                afterUpdate={(url) => {
                  console.log({ url });
                  setImageOverride(url);
                  reset();
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
