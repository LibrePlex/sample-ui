import { Td, Tr } from "@chakra-ui/react";
import {
    TokenDelegateRole,
    TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { RawAccount } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import {
    CopyPublicKeyButton,
    IRpcObject,
    SolscanLink,
    useLegacyMetadataByMintId,
    useLegacyTokenRecordByTokenAccount
} from "@libreplex/shared-ui";
import { FixStuckMigrationStateButton } from "./pnftfixer/FixStuckMigrationStateButton";
export const TokenAccountDisplay = ({
  tokenAccount,
  showAll,
}: {
  showAll: boolean;
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
        display:
          showAll ||
          tokenRecord?.item.delegateRole === TokenDelegateRole.Migration
            ? "show"
            : "none",
      }}
    >
      <Td>
        <SolscanLink mintId={tokenAccount.item.mint.toBase58()} />
        {/* <CopyPublicKeyButton publicKey={tokenAccount.item.mint.toBase58()} /> */}
      </Td>
      <Td>{legacyMetadata?.item.data.name}</Td>
      <Td>
        <CopyPublicKeyButton publicKey={tokenAccount.pubkey.toBase58()} />
      </Td>
      <Td>
        {legacyMetadata?.item?.tokenStandard ===
        TokenStandard.ProgrammableNonFungible
          ? "pNFT"
          : "NFT"}
      </Td>
      <Td>
        {tokenRecord?.item.delegateRole === TokenDelegateRole.Staking
          ? "Staking"
          : tokenRecord?.item.delegateRole === TokenDelegateRole.Migration
          ? "Migration"
          : "Other"}
      </Td>
      <Td>
        {(tokenRecord?.item.delegateRole === TokenDelegateRole.Migration ||
          (tokenRecord?.item.delegateRole === TokenDelegateRole.Staking &&
            tokenRecord.item.lockedTransfer === null)) && (
          <FixStuckMigrationStateButton
            params={{ tokenAccounts: [tokenAccount] }}
            formatting={{}}
          />
        )}
      </Td>
    </Tr>
  );
};
