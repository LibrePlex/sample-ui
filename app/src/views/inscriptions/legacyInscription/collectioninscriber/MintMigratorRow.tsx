import { InscribeLegacyMetadataAsUauthTransactionButton } from "@app/components/legacyInscriptions/InscribeLegacyMetadataAsUauthTransactionButton";
import { ImageUploader } from "@app/components/shadowdrive/ImageUploader";
import { Heading, Td, Tr } from "@chakra-ui/react";
import {
  CopyPublicKeyButton,
  useInscriptionForRoot,
  useOffChainMetadataCache,
} from "@libreplex/shared-ui";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import { ViewLegacyInscription } from "../ViewLegacyInscription";
import { CreateNewLegacyInscriptionModal } from "./CreateNewLegacyInscriptionModal";

export const MintMigratorRow = ({ mint }: { mint: PublicKey }) => {
  const { data } = useOffChainMetadataCache(mint);
  const { data: inscription } = useInscriptionForRoot(mint);

  const [imageOverride, setImageOverride] = useState<string>();
  return (
    <Tr>
      <Td>
        <CopyPublicKeyButton publicKey={mint.toBase58()} />
      </Td>
      <Td>{data?.name}</Td>
      <Td>
        <img src={data?.images.square ?? ""} />
      </Td>
      <Td>
       
          <CreateNewLegacyInscriptionModal mint={mint} />
          
      </Td>
    </Tr>
  );
};
