import {
  Button,
  ButtonProps,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
} from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { useInscriptionForMint } from "../useInscriptionForMint";
import { useInscriptionDataForMint } from "../useInscriptionDataForMint";
import { useLegacyInscriptionForMint } from "./useLegacyInscriptionForMint";
import { ResizeLegacyMetadataAsHolderTransactionButton } from "@app/components/legacyInscriptions/ResizeLegacyInscriptionAsHolderTransactionButton";
import { useLegacyMetadataByMintId } from "shared-ui/src";
import { useConnection } from "@solana/wallet-adapter-react";
import { useWebpAndHash } from "@app/utils/webp";

type AuthParams = {
  owner: PublicKey,
  tokenAccount: PublicKey
}

export const EditLegacyInscription = ({ mint}: { mint: PublicKey }) => {
  const inscription = useInscriptionForMint(mint);
  const legacyInscription = useLegacyInscriptionForMint(mint);
  const inscriptionData = useInscriptionDataForMint(mint);

  const { connection } = useConnection();
  const metadata = useLegacyMetadataByMintId(mint, connection);

  return (
    <Popover>
      <PopoverTrigger>
        <Button colorScheme="teal" size="xs">
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
                    <Text>{inscriptionData?.item.buffer.length}</Text>
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
                  <Th>
                    <Text color="#aaa">Validation hash</Text>
                  </Th>
                  <Td>
                    {/* <Text>{inscription?.item.validationHash}</Text> */}
                    <ResizeLegacyMetadataAsHolderTransactionButton
                      params={{
                        mint,
                        inscription,
                      }}
                      formatting={{}}
                    />
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
