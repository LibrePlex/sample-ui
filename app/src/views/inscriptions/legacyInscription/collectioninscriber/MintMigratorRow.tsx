import { InscribeLegacyMetadataAsUauthTransactionButton } from "@app/components/legacyInscriptions/InscribeLegacyMetadataAsUauthTransactionButton";
import { ImageUploader } from "@app/components/shadowdrive/ImageUploader";
import { Td, Tr } from "@chakra-ui/react";
import {
  CopyPublicKeyButton,
  useInscriptionForMint,
  useOffChainMetadataCache,
} from "@libreplex/shared-ui";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import { EditLegacyInscription } from "../EditLegacyInscription";

export const MintMigratorRow = ({ mint }: { mint: PublicKey }) => {
  const { data } = useOffChainMetadataCache(mint);
  const {data: inscription} = useInscriptionForMint(mint);

  const [imageOverride, setImageOverride] = useState<string>();
  return (
    <Tr>
      <Td>
        <CopyPublicKeyButton publicKey={mint.toBase58()} />
      </Td>
      <Td>{data?.name}</Td>
      <Td>
        <ImageUploader
          currentImage={imageOverride ?? data?.images.square}
          linkedAccountId={mint?.toBase58()}
          fileId={""}
          afterUpdate={(url) => {
            console.log({ url });
            setImageOverride(url);
          }}
        />
        {/* <HStack>
         */}
        {/* <Button size="xs">custom image</Button>
        </HStack> */}
      </Td>
      <Td>
        {inscription ? (
          <EditLegacyInscription mint={mint} />
        ) : (
          <InscribeLegacyMetadataAsUauthTransactionButton
            params={{
              mint,
              imageOverride,
            }}
            formatting={{}}
          />
        )}
      </Td>
    </Tr>
  );
};
