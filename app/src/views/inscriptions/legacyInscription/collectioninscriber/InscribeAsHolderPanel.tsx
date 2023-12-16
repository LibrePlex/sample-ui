import { Heading, Text, VStack } from "@chakra-ui/react";
import {
  MintWithTokenAccount,
  useInscriptionV3ForRoot,
  useLegacyCompressedImage,
  useMediaType,
  useOffChainMetadataCache,
} from "@libreplex/shared-ui";
import { useEffect, useMemo, useState } from "react";
import { useLegacyInscriptionForMint } from "../useLegacyInscriptionForMint";

export const InscribeAsHolderPanel = ({
  mint,
}: {
  mint: MintWithTokenAccount;
}) => {
  const { data } = useOffChainMetadataCache(mint?.mint);

  const [imageOverride, setImageOverride] = useState<string>();

  const {
    data: compressedImage,
    refetch: refetchOffchainData,
    isFetching: isFetchingOffchainData,
  } = useLegacyCompressedImage(mint.mint);

  const {
    inscription: { data: inscription },
  } = useInscriptionV3ForRoot(mint?.mint);

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
      {/* 
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
            <></>
          )}
        </VStack>
      )}
      {!inscription && (
        <InscribeLegacyMetadataAsHolderTransactionButton
          params={{
            mint,
          }}
          formatting={{}}
        />
      )} */}
    </VStack>
  );
};
