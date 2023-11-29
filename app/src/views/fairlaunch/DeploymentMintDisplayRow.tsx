import { Center, Td, Tr } from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { CopyPublicKeyButton, Deployment, IRpcObject, MintWithTokenAccount, SolscanLink, useLegacyMetadataByMintId } from "@libreplex/shared-ui";
import { SwapToFungibleTransactionButton } from "./SwapToFungibleTransactionButton";

export const DeploymentMintDisplayRow = ({ mint, deployment }: { mint: MintWithTokenAccount, deployment: IRpcObject<Deployment> }) => {
  const { connection } = useConnection();
  const metadata = useLegacyMetadataByMintId(mint.mint, connection);

  return (
    <Tr>
      <Td>
        <CopyPublicKeyButton publicKey={mint.mint.toBase58()} />
      </Td>
      <Td>
        <SolscanLink address={mint.mint.toBase58()} />
      </Td>
      {/* <Td>
        <Center>
        <SwapToFungibleTransactionButton params={{
            deployment, 
                nonFungibleMint: mint
        }} formatting={{}}  />
        </Center>
      </Td> */}
    </Tr>
  );
};
