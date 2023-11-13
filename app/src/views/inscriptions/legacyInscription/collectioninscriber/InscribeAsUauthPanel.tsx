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

export const InscribeAsUauthPanel = ({ mint }: { mint: PublicKey }) => {
  const [customImage, setCustomImage] = useState<boolean>(false);

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

  return (
    <VStack>
      <Heading pt={2} size="md">
        Inscribing as Update Authority
      </Heading>
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

      <Heading pt={2} size="sm">
        Choose inscription source
      </Heading>
      <HStack>
        <Button
          onClick={() => {
            setCustomImage(false);
          }}
          colorScheme="teal"
          variant={!customImage ? "solid" : "outline"}
        >
          Replicate off-chain
        </Button>
        <Button
          onClick={() => {
            setCustomImage(true);
          }}
          colorScheme="teal"
          variant={customImage ? "solid" : "outline"}
        >
          Override
        </Button>
      </HStack>
      <img style={{ borderRadius: "15px" }} src={data?.images.square ?? ""} />

      {!legacyInscription?.item ? (
        <>
          {!customImage ? (
            <VStack>
              <InscribeLegacyMetadataAsUauthTransactionButton
                params={{
                  mint,
                  imageOverride: undefined,
                }}
                formatting={{}}
              />
            </VStack>
          ) : (
            <VStack>
              <ImageUploader
                currentImage={imageOverride}
                linkedAccountId={mint?.toBase58()}
                afterUpdate={(url) => {
                  console.log({ url });
                  setImageOverride(url);
                }}
              />

              {imageOverride && (
                <>
                  {inscription ? (
                    <>
                      {" "}
                      <VStack>
                        {sizeOk ? (
                          <>
                            Size CHECK:
                            <HiCheckCircle color="lightgreen" /> (
                            {inscription?.item?.size} bytes)
                            <WriteToLegacyInscriptionAsUAuthTransactionButton
                              params={{
                                mint,
                                dataBytes: [...imageBuffer],
                                encodingType: { base64: {} },
                                mediaType,
                              }}
                              formatting={{}}
                            />
                            {mediaTypeToString(mediaType)}
                          </>
                        ) : (
                          <>
                            <Text>
                              Image sizes do not match. Current inscription
                              size: {inscription?.item.size}, need:{" "}
                              {imageBuffer?.length}
                            </Text>
                            <HiXCircle color="#f66" />
                          </>
                        )}
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
                  ) : (
                    <InscribeLegacyMetadataAsUauthTransactionButton
                      params={{
                        mint,
                        imageOverride,
                      }}
                      formatting={{}}
                    />
                  )}
                </>
              )}
            </VStack>
          )}
        </>
      ) : customImage ? (
        <></>
      ) : (
        <>
          {sizeOkCompressed ? (
            <>
              Size CHECK:
              <HiCheckCircle color="lightgreen" /> ({inscription?.item?.size}{" "}
              bytes)
              {compressedImage && (
                <WriteToLegacyInscriptionAsUAuthTransactionButton
                  params={{
                    mint: mint,
                    dataBytes: [...compressedImage.buf],
                    encodingType: { base64: {} },
                    mediaType,
                  }}
                  formatting={{}}
                />
              )}
              {mediaTypeToString(mediaType)}
            </>
          ) : (
            <>
              <Text>
                Image sizes do not match. Current inscription size:{" "}
                {inscription?.item.size}, need: {compressedImage?.buf.length}
              </Text>
              <HiXCircle color="#f66" />
            </>
          )}
          {compressedImage?.buf && !sizeOkCompressed && (
            <ResizeLegacyMetadataAsUAuthTransactionButton
              params={{
                mint: mint,
                targetSize: compressedImage?.buf.length,
                currentSize: inscription?.item.size,
              }}
              formatting={{}}
            />
          )}
        </>
      )}
    </VStack>
  );
};
