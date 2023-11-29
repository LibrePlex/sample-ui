import {
  Connection,
  Keypair,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";

import { VStack } from "@chakra-ui/react";
import {
  Deployment,
  GenericTransactionButton,
  GenericTransactionButtonProps,
  IExecutorParams,
  IRpcObject,
  ITransactionTemplate,
  MintWithTokenAccount,
  PROGRAM_ID_INSCRIPTIONS,
  getHashlistPda,
  getLegacyMetadataPda,
  getMasterEditionPda,
  getProgramInstanceFairLaunch,
  notify,
} from "@libreplex/shared-ui";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

export interface IDeployTransactionButton {
  deployment: IRpcObject<Deployment>;
  fungibleSourceAccount: MintWithTokenAccount;
  nonFungibleSourceAccount: MintWithTokenAccount
}

export const swapToNonFungible = async (
  { wallet, params }: IExecutorParams<IDeployTransactionButton>,
  connection: Connection,
  cluster: string
): Promise<{
  data?: ITransactionTemplate[];
  error?: any;
}> => {
  const data: ITransactionTemplate[] = [];

  const { deployment, fungibleSourceAccount, nonFungibleSourceAccount } = params;

  const fairLaunch = getProgramInstanceFairLaunch(connection, wallet);

  if (!fairLaunch) {
    throw Error("IDL not ready");
  }

  const instructions: TransactionInstruction[] = [];

  const fungibleMint = Keypair.generate();
  const nonFungibleMint = Keypair.generate();

  const nonFungibleTargetTokenAccount = getAssociatedTokenAddressSync(
    nonFungibleMint.publicKey,
    wallet.publicKey
  );



  const fungibleTargetTokenAccount = getAssociatedTokenAddressSync(
    fungibleMint.publicKey,
    deployment.pubkey,
    true
  );



  instructions.push(
    await fairLaunch.methods
      .swapToNonfungible()
      .accounts({
        deployment: deployment.pubkey,
        payer: wallet.publicKey,
        fungibleMint: fungibleMint.publicKey,
        nonFungibleMint: nonFungibleMint.publicKey,
        nonFungibleSourceAcountEscrow: nonFungibleSourceAccount.tokenAccount.pubkey,
        nonFungibleTargetTokenAccount,
        fungibleSourceTokenAccount: fungibleSourceAccount.tokenAccount.pubkey,
        fungibleTargetTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        inscriptionsProgram: PROGRAM_ID_INSCRIPTIONS,
        systemProgram: SystemProgram.programId,
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
        text={`Launch deployment`}
        transactionGenerator={swapToNonFungible}
        onError={(msg) =>
          notify({ message: msg ?? "Unknown error", type: "error" })
        }
        size="lg"
        {...props}
        formatting={{ colorScheme: "red" }}
      />
    </VStack>
  );
};
