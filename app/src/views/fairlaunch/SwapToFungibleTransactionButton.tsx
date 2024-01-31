import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";

import { VStack } from "@chakra-ui/react";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
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
import { DEPLOYMENT_TYPE_2022 } from "./MintTransactionButton";
import { getTokenProgramForDeployment } from "./useTokenProgramsForDeployment";

export interface IDeployTransactionButton {
  deployment: IRpcObject<Deployment>;
  nonFungibleMint: MintWithTokenAccount;
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

  const { deployment, nonFungibleMint } = params;

  const tokenProgram = getTokenProgramForDeployment(deployment);
  const fairLaunch = getProgramInstanceFairLaunch(connection, wallet);

  if (!fairLaunch) {
    throw Error("IDL not ready");
  }

  const instructions: TransactionInstruction[] = [];

  const fungibleMint = deployment.item.fungibleMint;

  const fungibleSourceTokenAccount = getAssociatedTokenAddressSync(
    fungibleMint,
    deployment.pubkey,
    true,
    tokenProgram
  );

  const fungibleTargetTokenAccount = getAssociatedTokenAddressSync(
    fungibleMint,
    wallet.publicKey,
    false,
    tokenProgram
  );

  const nonFungibleTargetTokenAccount = getAssociatedTokenAddressSync(
    nonFungibleMint.mint,
    deployment.pubkey,
    true,
    tokenProgram
  );

  if (deployment.item.deploymentType === DEPLOYMENT_TYPE_2022) {
    instructions.push(
      await fairLaunch.methods
        .swapToFungible22()
        .accounts({
          deployment: deployment.pubkey,
          payer: wallet.publicKey,
          fungibleMint,
          fungibleSourceTokenAccount,
          fungibleTargetTokenAccount,
          nonFungibleMint: nonFungibleMint.mint,
          nonFungibleSourceTokenAccount: nonFungibleMint.tokenAccount.pubkey,
          nonFungibleTargetTokenAccount,
          tokenProgram,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          sysvarInstructions: new PublicKey(
            "Sysvar1nstructions1111111111111111111111111"
          ),
        })
        .instruction()
    );
  } else {
    instructions.push(
      await fairLaunch.methods
        .swapToFungible()
        .accounts({
          deployment: deployment.pubkey,
          payer: wallet.publicKey,
          fungibleMint,
          fungibleSourceTokenAccount,
          fungibleTargetTokenAccount,
          nonFungibleMint: nonFungibleMint.mint,
          nonFungibleSourceTokenAccount: nonFungibleMint.tokenAccount.pubkey,
          nonFungibleTargetTokenAccount,
          tokenProgram,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          sysvarInstructions: new PublicKey(
            "Sysvar1nstructions1111111111111111111111111"
          ),
        })
        .instruction()
    );
  }

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

export const SwapToFungibleTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IDeployTransactionButton>,
    "transactionGenerator"
  >
) => {
  return (
    <VStack gap={2}>
      <GenericTransactionButton<IDeployTransactionButton>
        text={`Swap to SPL`}
        multiUse={false}
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
