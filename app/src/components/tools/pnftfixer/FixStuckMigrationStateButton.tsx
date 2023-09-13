import { HStack, Text } from "@chakra-ui/react";
import {
  Metaplex,
  token,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import {
  RawAccount,
  TOKEN_PROGRAM_ID,
  createCloseAccountInstruction,
  createInitializeAccountInstruction,
  getAccountLenForMint,
  getMint
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  SystemProgram,
  TransactionInstruction
} from "@solana/web3.js";
import { useState } from "react";
import {
  GenericTransactionButton,
  GenericTransactionButtonProps, IExecutorParams, IRpcObject, ITransactionTemplate
} from  "@libreplex/shared-ui";

import { notify } from  "@libreplex/shared-ui";

export enum AssetType {
  Image,
  Ordinal,
}

// export type Asset = {
//   type: AssetType.Image,
// } | {
//   type: AssetType.Ordinal
// }

export interface IFixStuckMigration {
  tokenAccounts: IRpcObject<RawAccount>[];
}

export const fixStuckMigration = async (
  { wallet, params }: IExecutorParams<IFixStuckMigration>,
  connection: Connection
): Promise<{
  data?: ITransactionTemplate[];
  error?: any;
}> => {
  if (!wallet.publicKey) {
    throw Error("Wallet key missing");
  }

  const data: {
    instructions: TransactionInstruction[];
    signers: Keypair[];
    description: string;
  }[] = [];

  const metaplex = new Metaplex(connection);
  metaplex.use(
    walletAdapterIdentity({
      publicKey: wallet.publicKey,
      signTransaction: async (tx) => tx,
    })
  );

  const { tokenAccounts } = params;

  const tokenAccountsRemaining = [...tokenAccounts];

  while (tokenAccountsRemaining.length > 0) {
    const tokenAccountBatch = tokenAccountsRemaining.splice(0, 10);

    for (const tokenAccount of tokenAccountBatch) {
      const instructions: TransactionInstruction[] = [];

      // Otherwise, create the account with the provided keypair and return its public key
      const mintState = await getMint(
        connection,
        tokenAccount.item.mint,
        "recent",
        TOKEN_PROGRAM_ID
      );
      const space = getAccountLenForMint(mintState);
      const lamports = await connection.getMinimumBalanceForRentExemption(
        space
      );

      const newTokenAccountKey = Keypair.generate();

      instructions.push(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: newTokenAccountKey.publicKey,
          space,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccountInstruction(
          newTokenAccountKey.publicKey,
          tokenAccount.item.mint,
          wallet.publicKey,
          TOKEN_PROGRAM_ID
        )
      );

      const nft = await metaplex
        .nfts()
        .findByMint({ mintAddress: tokenAccount.item.mint });

      instructions.push(
        ...metaplex
          .nfts()
          .builders()
          .transfer({
            nftOrSft: nft,
            fromOwner: wallet.publicKey,
            toOwner: wallet.publicKey,
            amount: token(1),
            fromToken: tokenAccount.pubkey,
            toToken: newTokenAccountKey.publicKey,
          })
          .getInstructions()
      );

      // close old token account
      instructions.push(
        createCloseAccountInstruction(
          tokenAccount.pubkey,
          wallet.publicKey,
          wallet.publicKey,
          [],
          TOKEN_PROGRAM_ID
        )
      );

      data.push({
        instructions,
        description: `Fix migration state`,
        signers: [newTokenAccountKey],
      });
    }
  }

  console.log({ data });

  return {
    data,
  };
};

export const FixStuckMigrationStateButton = (
  props: Omit<
    GenericTransactionButtonProps<IFixStuckMigration>,
    "transactionGenerator"
  >
) => {
  const [success, setSuccess] = useState<boolean>(false);
  return (
    <HStack justifyContent={"center"}>
      {success ? (
        <Text>Fixed</Text>
      ) : (
        <GenericTransactionButton<IFixStuckMigration>
          text={"Fix state"}
          transactionGenerator={fixStuckMigration}
          onError={(msg) => notify({ message: msg })}
          onSuccess={() => {
            setSuccess(true);
          }}
          {...props}
        />
      )}
    </HStack>
  );
};
