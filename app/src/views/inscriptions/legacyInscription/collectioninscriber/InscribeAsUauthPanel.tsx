import { HiCheckCircle, HiXCircle, HiSearch } from "react-icons/hi";
import { InscribeLegacyMetadataAsUauthTransactionButton } from "@app/components/legacyInscriptions/InscribeLegacyMetadataAsUauthTransactionButton";
import { Button, HStack, Heading, VStack, Text } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { useMemo, useState } from "react";
import {
  useInscriptionDataForRoot,
  useInscriptionForRoot,
  useOffChainMetadataCache,
} from "@libreplex/shared-ui";
import { ImageUploader } from "@app/components/shadowdrive/ImageUploader";
import { useOffchainImageAsBuffer } from "shared-ui/src/components/inscriptionDisplay/useOffchainImageAsBuffer";
import { useValidationHash } from "../../useValidationHash";
import { ResizeLegacyMetadataAsHolderTransactionButton } from "@app/components/legacyInscriptions/ResizeLegacyInscriptionAsHolderTransactionButton";
import { ResizeLegacyMetadataAsUAuthTransactionButton } from "@app/components/legacyInscriptions/ResizeLegacyInscriptionAsUAuthTransactionButton";
import { WriteToLegacyInscriptionAsUAuthTransactionButton } from "@app/components/legacyInscriptions/WriteToLegacyInscriptionAsUAuthTransactionButton";
import {useMediaType} from "@libreplex/shared-ui"
import { mediaTypeToString } from "shared-ui/src/components/inscriptionDisplay/useMediaType";

export const InscribeAsUauthPanel = ({ mint }: { mint: PublicKey }) => {
  const [customImage, setCustomImage] = useState<boolean>(false);

  const { data } = useOffChainMetadataCache(mint);

  const [imageOverride, setImageOverride] = useState<string>();

  const { data: imageBuffer, refetch } =
    useOffchainImageAsBuffer(imageOverride);

  const validationHash = useValidationHash(imageBuffer);

  const { data: inscription } = useInscriptionForRoot(mint);

  const sizeOk = useMemo(
    () => imageBuffer?.length === inscription?.item.size,
    [imageBuffer, inscription]
  );

  // for now use the extension to figure out the subtype
  const mediaType = useMediaType(imageOverride ?? data?.images?.square)

  return (
    <VStack>
      <Heading pt={2} size="md">
        Current inscription
      </Heading>
      

      <Heading pt={2} size="md">
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
          Copy off-chain image
        </Button>
        <Button
          onClick={() => {
            setCustomImage(true);
          }}
          colorScheme="teal"
          variant={customImage ? "solid" : "outline"}
        >
          Custom
        </Button>
      </HStack>

      {!customImage && (
        <VStack>
          <img
            style={{ borderRadius: "15px" }}
            src={data?.images.square ?? ""}
          />

          <InscribeLegacyMetadataAsUauthTransactionButton
            params={{
              mint,
              imageOverride: undefined,
            }}
            formatting={{}}
          />
        </VStack>
      )}

      {customImage && (
        <VStack>
          <ImageUploader
            currentImage={imageOverride}
            linkedAccountId={mint?.toBase58()}
            afterUpdate={(url) => {
              console.log({ url });
              setImageOverride(url);
            }}
          />
          {/* <Text>Buffer length: {JSON.stringify(imageBuffer)}</Text>
          <Text>Image: {imageOverride}</Text>
           */}

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
                            encodingType: {base64: {}},
                            mediaType
                          }}
                          formatting={{}}
                        />
                        {mediaTypeToString(mediaType)}
                      </>
                    ) : (
                      <>
                        <Text>
                          Image sizes do not match. Current inscription size:{" "}
                          {inscription?.item.size}, need: {imageBuffer?.length}
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
    </VStack>
  );
};
