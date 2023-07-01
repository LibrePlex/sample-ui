import { Td, Tr } from "@chakra-ui/react";
import { RawAccount } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import {
  CopyPublicKeyButton,
  IRpcObject,
  getLegacyMetadataPda,
  useLegacyMetadataByMintId,
} from "shared-ui";
import { useLegacyTokenRecordByTokenAccount } from "shared-ui";
import { FixStuckMigrationStateButton } from "./pnftfixer/FixStuckMigrationStateButton";
import {TokenStandard, TokenDelegateRole} from "@metaplex-foundation/mpl-token-metadata"
export const TokenAccountDisplay = ({
  tokenAccount,
}: {
  tokenAccount: IRpcObject<RawAccount>;
}) => {
  const { connection } = useConnection();
  const legacyMetadata = useLegacyMetadataByMintId(
    tokenAccount.item.mint,
    connection
  );
  const tokenRecord = useLegacyTokenRecordByTokenAccount(
    tokenAccount,
    connection
  );

  return (
    <Tr
      sx={{
        display: legacyMetadata?.item?.tokenStandard !== 4 || tokenRecord.item.delegateRole !== TokenDelegateRole.Migration ? "none" : "show",
      }}
    >
      <Td>
        <CopyPublicKeyButton publicKey={tokenAccount.item.mint.toBase58()} />
      </Td>
      <Td>
        <CopyPublicKeyButton publicKey={tokenAccount.pubkey.toBase58()} />
      </Td>
      <Td>{legacyMetadata?.item?.tokenStandard === TokenStandard.ProgrammableNonFungible? 'pNFT': 'NFT'}</Td>
      <Td>{tokenRecord?.item.delegateRole === TokenDelegateRole.Staking ? 'Staking'
      : tokenRecord?.item.delegateRole === TokenDelegateRole.Migration ? 'Migration'
      : 'Other'}</Td>
      <td>
        <FixStuckMigrationStateButton
          params={{ tokenAccounts: [tokenAccount] }}
          formatting={{}}
        />
      </td>
    </Tr>
  );
};
