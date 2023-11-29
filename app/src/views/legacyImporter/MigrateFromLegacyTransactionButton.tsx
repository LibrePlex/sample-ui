import {
    Connection,
    SystemProgram,
    TransactionInstruction
} from "@solana/web3.js";
import BN from "bn.js";

import { VStack } from "@chakra-ui/react";
import {
    GenericTransactionButton,
    GenericTransactionButtonProps,
    IExecutorParams,
    IRpcObject,
    ITransactionTemplate,
    getDeploymentPda,
    getProgramInstanceFairLaunch,
    notify
} from "@libreplex/shared-ui";
import { Validator } from "./useLegacyValidators";

export interface IDeployTransactionButton {
  validator: IRpcObject<Validator>;
  limitPerMint: number;
}

export const launchDeployment = async (
  { wallet, params }: IExecutorParams<IDeployTransactionButton>,
  connection: Connection,
  cluster: string
): Promise<{
  data?: ITransactionTemplate[];
  error?: any;
}> => {
  const data: ITransactionTemplate[] = [];

  const { validator, limitPerMint } = params;

  const fairLaunch = getProgramInstanceFairLaunch(connection, wallet);

  if (!fairLaunch) {
    throw Error("IDL not ready");
  }

  const instructions: TransactionInstruction[] = [];

  const ticker = validator.item.ticker.trim();

  const deployment = getDeploymentPda(ticker)[0];

  instructions.push(
    await fairLaunch.methods
      .migrateFromValidator({
        limitPerMint: new BN(limitPerMint),
        maxNumberOfTokens: new BN(validator.item.validationCountMax),
        decimals: 9,
        ticker,
        deploymentTemplate: "",
        mintTemplate: validator.item.ticker,
        offchainUrl: validator.item.jsonUrl,
      },
      new BN(
        validator.item.validationCountMax > 0
          ? Math.min(
              validator.item.validationCountCurrent,
              validator.item.validationCountMax
            )
          : validator.item.validationCountCurrent
      )
      )
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
    description: `Migrate from legacy`,
    signers: [],
    blockhash,
  });

  console.log({ data });

  return {
    data,
  };
};

export const MigrateFromLegacyTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IDeployTransactionButton>,
    "transactionGenerator"
  >
) => {
  return (
    <VStack gap={2}>
      <GenericTransactionButton<IDeployTransactionButton>
        text={`migrate`}
        transactionGenerator={launchDeployment}
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
