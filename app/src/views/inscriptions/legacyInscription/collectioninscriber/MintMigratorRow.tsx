import { Td, Tr, VStack } from "@chakra-ui/react";
import {
  CopyPublicKeyButton,
  ScannerLink,
  SolscanLink,
  useOffChainMetadataCache,
} from "@libreplex/shared-ui";
import { PublicKey } from "@solana/web3.js";
import { InscriptionImage } from "shared-ui/src/components/inscriptionDisplay/InscriptionImage";
import { CreateNewLegacyInscriptionModal } from "./CreateNewLegacyInscriptionModal";

export const MintMigratorRow = ({ mint }: { mint: PublicKey }) => {
  const { data } = useOffChainMetadataCache(mint);

  return (
    <Tr>
      <Td>
        <CopyPublicKeyButton publicKey={mint.toBase58()} />
      </Td>
      <Td>{data?.name}</Td>
      <Td>
        <div className="bg-indigo-300 rounded-md overflow-hidden max-h-24 max-w-24 w-24">
          {/* <div className="object-cover"> */}
          <img
            src={data?.images.square ?? ""}
            className="object-cover max-w-full max-h-full h-full h-24 w-24"
            // style={{height: '100px'}}
          />
          {/* </div> */}
        </div>
      </Td>

      <Td>
        <div className="bg-indigo-300 rounded-md overflow-hidden max-h-24 max-w-24">
          <InscriptionImage root={mint} className="h-24" />
        </div>
      </Td>
      <Td>
        <VStack>
          <SolscanLink address={mint.toBase58()} />
          <ScannerLink mintId={mint} />
        </VStack>
      </Td>
      <Td>
        <CreateNewLegacyInscriptionModal mint={mint} />
      </Td>
    </Tr>
  );
};
