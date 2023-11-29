import { Center, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import {
  CopyPublicKeyButton,
  Deployment,
  IRpcObject,
  MintWithTokenAccount,
  useLegacyMetadataByMintId,
} from "@libreplex/shared-ui";

import { Metadata as LegacyMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { DeploymentMintDisplayRow } from "./DeploymentMintDisplayRow";

export const DeploymentMintDisplay = ({ mints, deployment }: { mints: MintWithTokenAccount[], deployment: IRpcObject<Deployment> }) => {
  return (
    <Table>
      <Thead>
        <Th>Mint</Th>
        {/* <Th><Center>Swap</Center></Th> */}
      </Thead>
      <Tbody>
        {mints?.map((item, idx) => (
          <DeploymentMintDisplayRow key={idx} mint={item} deployment={deployment}/>
        ))}
      </Tbody>
    </Table>
  );
};
