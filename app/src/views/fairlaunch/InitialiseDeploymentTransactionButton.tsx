import {
  Connection,
  SystemProgram,
  TransactionInstruction
} from "@solana/web3.js";

import { VStack } from "@chakra-ui/react";
import { IdlTypes } from "@coral-xyz/anchor";
import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
  IExecutorParams,
  ITransactionTemplate,
  getDeploymentPda,
  getProgramInstanceFairLaunch,
  notify
} from "@libreplex/shared-ui";
import { LibreplexFairLaunch } from "shared-ui/src/anchor/fair_launch/libreplex_fair_launch";

export interface IInitialiseDeploymentTransactionButton {
  input: CreateInitialiseInputs;
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

  const { input } = params;

  const instructions: TransactionInstruction[] = [];

  const deployment = getDeploymentPda(input.ticker)[0];
  console.log({input})

  instructions.push(
    await fairlaunchProgram.methods
      .initialise(input)
      .accounts({
        deployment,
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

export const InitialiseDeploymentTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IInitialiseDeploymentTransactionButton>,
    "transactionGenerator"
  >
) => {
  return (
    <VStack gap={2}>
      <GenericTransactionButton<IInitialiseDeploymentTransactionButton>
        text={`Create deployment`}
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
