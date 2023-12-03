import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";

import { VStack } from "@chakra-ui/react";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  AccountLayout,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  Deployment,
  GenericTransactionButton,
  GenericTransactionButtonProps,
  IExecutorParams,
  IRpcObject,
  ITransactionTemplate,
  MintWithTokenAccount,
  getProgramInstanceFairLaunch,
  notify,
} from "@libreplex/shared-ui";

export interface IDeployTransactionButton {
  deployment: IRpcObject<Deployment>;
  nonFungibleMint: MintWithTokenAccount;
  fungibleTokenAccount: MintWithTokenAccount;
}

export const generateTx = async (
  { wallet, params }: IExecutorParams<IDeployTransactionButton>,
  connection: Connection,
  cluster: string
): Promise<{
  data?: ITransactionTemplate[];
  error?: any;
}> => {
  const data: ITransactionTemplate[] = [];

  const { deployment, nonFungibleMint, fungibleTokenAccount } = params;

  const fairLaunch = getProgramInstanceFairLaunch(connection, wallet);

  if (!fairLaunch) {
    throw Error("IDL not ready");
  }

  const instructions: TransactionInstruction[] = [];

  const fungibleMint = deployment.item.fungibleMint;

  const fungibleTargetTokenAccount = getAssociatedTokenAddressSync(
    fungibleMint,
    deployment.pubkey,
    true
  );

  const nonFungibleTargetTokenAccount = getAssociatedTokenAddressSync(
    nonFungibleMint.mint,
    wallet.publicKey
  );

  const fungibleSourceTokenAccount = fungibleTokenAccount.tokenAccount.pubkey;

  const accountData = await connection.getAccountInfo(
    fungibleSourceTokenAccount
  );

  const tokenAccount = AccountLayout.decode(accountData.data);

  if (Number(tokenAccount.amount) < Number(deployment.item.limitPerMint)) {
    throw Error("Insufficient tokens available ");
  }

  const nonFungibleSourceTokenAccount = getAssociatedTokenAddressSync(
    nonFungibleMint.mint,
    deployment.pubkey,
    true
  );
  instructions.push(
    await fairLaunch.methods
      .swapToNonfungible()
      .accounts({
        deployment: deployment.pubkey,
        payer: wallet.publicKey,
        fungibleMint,
        fungibleTargetTokenAccount,
        fungibleSourceTokenAccount,
        nonFungibleSourceTokenAccount,
        nonFungibleMint: nonFungibleMint.mint,
        nonFungibleTargetTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        sysvarInstructions: new PublicKey(
          "Sysvar1nstructions1111111111111111111111111"
        ),
      })
      .instruction()
  );

  const blockhash = await connection.getLatestBlockhash();

  data.push({
    instructions,
    description: `Swap on token to fungible`,
    signers: [],
    blockhash,
  });

  console.log({ data });

  return {
    data,
  };
};

export const SwapToNonFungibleTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IDeployTransactionButton>,
    "transactionGenerator"
  >
) => {
  return (
    <VStack gap={2}>
      <GenericTransactionButton<IDeployTransactionButton>
        text={`Swap to NFT`}
        transactionGenerator={generateTx}
        onError={(msg) =>
          notify({ message: msg ?? "Unknown error", type: "error" })
        }
        size="sm"
        {...props}
        formatting={{ colorScheme: "red" }}
      />
    </VStack>
  );
};
