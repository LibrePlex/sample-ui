import { InscribeLegacyMetadataAsHolderTransactionButton } from "@app/components/legacyInscriptions/InscribeLegacyMetadataAsHolderTransactionButton";
import { Heading, Text, VStack } from "@chakra-ui/react";
import {
  MintWithTokenAccount,
  useInscriptionForRoot,
  useLegacyCompressedImage,
  useMediaType,
  useOffChainMetadataCache,
} from "@libreplex/shared-ui";
import { useEffect, useMemo, useState } from "react";
import { useOffchainImageAsBuffer } from "shared-ui/src/components/inscriptionDisplay/useOffchainImageAsBuffer";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { mediaTypeToString } from "@libreplex/shared-ui";
import { WriteToLegacyInscriptionAsUAuthTransactionButton } from "@app/components/legacyInscriptions/WriteToLegacyInscriptionAsUAuthTransactionButton";
import { WriteToLegacyInscriptionAsHolderTransactionButton } from "@app/components/legacyInscriptions/WriteToLegacyInscriptionAsHolderTransactionButton";
import { ResizeLegacyMetadataAsHolderTransactionButton } from "@app/components/legacyInscriptions/ResizeLegacyInscriptionAsHolderTransactionButton";
import { useLegacyInscriptionForMint } from "../useLegacyInscriptionForMint";

export const InscribeAsHolderPanel = ({
  mint,
}: {
  mint: MintWithTokenAccount;
}) => {
  const [customImage, setCustomImage] = useState<boolean>(false);

  const { data } = useOffChainMetadataCache(mint?.mint);

  const [imageOverride, setImageOverride] = useState<string>();

  const { data: imageBuffer, refetch } =
    useOffchainImageAsBuffer(imageOverride);

  const {
    data: compressedImage,
    refetch: refetchOffchainData,
    isFetching: isFetchingOffchainData,
  } = useLegacyCompressedImage(mint.mint);

  const {
    inscription: { data: inscription },
  } = useInscriptionForRoot(mint?.mint);

  const sizeOk = useMemo(
    () => compressedImage?.buf?.length === inscription?.item.size,
    [compressedImage, inscription]
  );

  const legacyInscription = useLegacyInscriptionForMint(mint?.mint);

  useEffect(() => {
    console.log({ inscription });
  }, [inscription]);

  // for now use the extension to figure out the subtype
  const mediaType = useMediaType(imageOverride ?? data?.images?.square);

  return (
    <VStack>
      <Heading pt={2} size="md">
        Inscribing as Holder
      </Heading>

      {legacyInscription?.item.authorityType.holder ? (
        <Text pt={2}>
          As a holder you can replicate the off-chain image and inscribe it on
          the chain for all eternity!
        </Text>
      ) : (
        <Text>
          This item has already been inscribed by the update authority holder.
          Please contact them to update the inscription
        </Text>
      )}

      {legacyInscription?.item.authorityType.holder && (
        <VStack>
          <img
            style={{ borderRadius: "15px" }}
            src={data?.images.square ?? ""}
          />

          {inscription ? (
            <>
              {" "}
              <VStack>
                {sizeOk ? (
                  <>
                    Size CHECK:
                    <HiCheckCircle color="lightgreen" /> (
                    {inscription?.item?.size} bytes)
                    {compressedImage && (
                      <WriteToLegacyInscriptionAsHolderTransactionButton
                        params={{
                          mint: mint.mint,
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
                      {inscription?.item.size}, need:{" "}
                      {compressedImage?.buf.length}
                    </Text>
                    <HiXCircle color="#f66" />
                  </>
                )}
                {compressedImage?.buf &&
                  compressedImage?.buf.length !== inscription?.item.size && (
                    <ResizeLegacyMetadataAsHolderTransactionButton
                      params={{
                        mint: mint.mint,
                        targetSize: compressedImage?.buf.length,
                        currentSize: inscription?.item.size,
                      }}
                      formatting={{}}
                    />
                  )}
              </VStack>
            </>
          ) : (
            <InscribeLegacyMetadataAsHolderTransactionButton
              params={{
                mint,
              }}
              formatting={{}}
            />
          )}
        </VStack>
      )}
    </VStack>
  );
};
