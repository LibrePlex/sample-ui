import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction
} from "@solana/web3.js";

import { VStack } from "@chakra-ui/react";
import { IdlTypes } from "@coral-xyz/anchor";
import {
  Deployment,
  GenericTransactionButton,
  GenericTransactionButtonProps,
  IExecutorParams,
  IRpcObject,
  ITransactionTemplate,
  getDeploymentPda,
  getProgramInstanceFairLaunch,
  notify
} from "@libreplex/shared-ui";
import { LibreplexFairLaunch } from "shared-ui/src/anchor/fair_launch/libreplex_fair_launch";

export interface IInitialiseDeploymentTransactionButton {
  deploymentPublicKey: PublicKey
}

export type CreateInitialiseInputs =
  IdlTypes<LibreplexFairLaunch>["InitialiseInput"];

export const depositSolTransactionButton = async (
  { wallet, params }: IExecutorParams<IInitialiseDeploymentTransactionButton>,
  connection: Connection,
  cluster: string
): Promise<{
  data?: ITransactionTemplate[];
  error?: any;
}> => {
  const data: ITransactionTemplate[] = [];

  const fairlaunchProgram = getProgramInstanceFairLaunch(connection, wallet);

  if (!fairlaunchProgram) {
    throw Error("IDL not ready");
  }

  const { deploymentPublicKey } = params;

  const instructions: TransactionInstruction[] = [];


  instructions.push(
    await fairlaunchProgram.methods
      .setTokens()
      .accounts({
        deployment: deploymentPublicKey,
        payer: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .instruction()
  );

  const blockhash = await connection.getLatestBlockhash();

  data.push({
    instructions,
    description: `Initialize deployment`,
    signers: [],
    blockhash,
  });

  console.log({ data });

  return {
    data,
  };
};

export const SetTokensTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IInitialiseDeploymentTransactionButton>,
    "transactionGenerator"
  >
) => {
  return (
    <VStack gap={2}>
      <GenericTransactionButton<IInitialiseDeploymentTransactionButton>
        text={`Set amount`}
        transactionGenerator={depositSolTransactionButton}
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
