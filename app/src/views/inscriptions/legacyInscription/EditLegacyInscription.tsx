import { ResizeLegacyMetadataAsHolderTransactionButton } from "@app/components/legacyInscriptions/ResizeLegacyInscriptionAsHolderTransactionButton";
import { WriteToLegacyInscriptionAsHolderTransactionButton } from "@app/components/legacyInscriptions/WriteToLegacyInscriptionAsHolderTransactionButton";
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Skeleton,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
} from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { useInscriptionDataForMint } from "../useInscriptionDataForMint";
import { useInscriptionForMint } from "../useInscriptionForMint";
import { useLegacyCompressedImage } from "./useLegacyCompressedImage";
import { useLegacyInscriptionForMint } from "./useLegacyInscriptionForMint";
import { useValidationHash } from "../useValidationHash";

export const EditLegacyInscription = ({ mint }: { mint: PublicKey }) => {
  const inscription = useInscriptionForMint(mint);
  const legacyInscription = useLegacyInscriptionForMint(mint);
  const { data: inscriptionData, refetch: refetchData } =
    useInscriptionDataForMint(mint);

  const hashOfInscription = useValidationHash(inscriptionData?.item.buffer);

  const {
    data: compressedImage,
    refetch: refetchOffchainData,
    isFetching,
  } = useLegacyCompressedImage(mint, false);

  const base64Image = useMemo(
    () => Buffer.from(compressedImage?.buf ?? []).toString("base64"),
    [compressedImage]
  );

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          colorScheme="teal"
          size="xs"
          onClick={async () => {
            await refetchOffchainData();
            await refetchData();
          }}
        >
          Edit
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>Edit Inscription</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <Table>
              <Tbody>
                <Tr>
                  <Th>
                    <Text color="#aaa">Size (bytes)</Text>
                  </Th>
                  <Td>
                    <Text>{inscription?.item.size}</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Th>
                    <Text color="#aaa">Rent (SOL)</Text>
                  </Th>
                  <Td>
                    <Text>
                      {(
                        (inscriptionData
                          ? Number(inscriptionData.item.balance.toString())
                          : 0) / Number(1_000_000_000)
                      ).toLocaleString()}
                    </Text>
                  </Td>
                </Tr>
                <Tr>
                  <Th>
                    <Text color="#aaa">Created by</Text>
                  </Th>
                  <Td>
                    <Text>
                      {legacyInscription?.item.authorityType.holder
                        ? "Holder"
                        : "UAuth"}
                    </Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Text color="#aaa">Offchain data</Text>
                    {isFetching ? (
                      <Spinner />
                    ) : (
                      <Button size="sm" onClick={() => refetchOffchainData()}>
                        Fetch
                      </Button>
                    )}
                    {hashOfInscription !== compressedImage?.hash
                      ? "Hash mismatch"
                      : "Hash OK"}
                    <Button size="sm" onClick={() => refetchData()}>
                      Refresh
                    </Button>
                  </Td>
                  <Td>
                    {base64Image ? (
                      <img src={`data:image/webp;base64,${base64Image}`} />
                    ) : (
                      <Skeleton
                        style={{
                          minWidth: "135px",
                          maxWidth: "135px",
                          aspectRatio: "1/1",
                          borderRadius: 8,
                        }}
                      />
                    )}
                    {compressedImage?.buf.length === inscription.item.size && (
                      <Text variant="body2">Size OK</Text>
                    )}
                    {compressedImage?.buf &&
                      compressedImage?.buf.length !== inscription.item.size && (
                        <ResizeLegacyMetadataAsHolderTransactionButton
                          params={{
                            mint,
                            targetSize: compressedImage?.buf.length,
                            currentSize: inscription.item.size,
                          }}
                          formatting={{}}
                        />
                      )}
                    {compressedImage?.buf && (
                      <WriteToLegacyInscriptionAsHolderTransactionButton
                        params={{
                          mint,
                          dataBytes: [...compressedImage?.buf],
                        }}
                        formatting={{}}
                      />
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td colSpan={2}>Update</Td>
                </Tr>
              </Tbody>
            </Table>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
