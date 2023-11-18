import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
  IExecutorParams,
  ITransactionTemplate,
  getInscriptionPda,
  getInscriptionV3Pda,
  getProgramInstanceInscriptions,
} from "@libreplex/shared-ui";
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";

import { VStack } from "@chakra-ui/react";
import { getMigratorPda, notify } from "@libreplex/shared-ui";
import { useMemo } from "react";
export interface IMigrateToV3TransactionButton {
  root: PublicKey;
}

export const migrateToV3 = async (
  { wallet, params }: IExecutorParams<IMigrateToV3TransactionButton>,
  connection: Connection,
  cluster: string
): Promise<{
  data?: ITransactionTemplate[];
  error?: any;
}> => {
  const data: ITransactionTemplate[] = [];

  const inscriptionsProgram = getProgramInstanceInscriptions(
    connection,
    wallet
  );

  if (!inscriptionsProgram) {
    throw Error("IDL not ready");
  }

  // have to check the owner here - unfortunate as it's expensive
  const { root: mint } = params;

  const inscription = getInscriptionPda(mint)[0];

  const inscription3 = getInscriptionV3Pda(mint)[0];

  const migrator = getMigratorPda(mint)[0];

  const instructions: TransactionInstruction[] = [];

  const blockhash = await connection.getLatestBlockhash()
  // reduce the first batch size a bit since we're passing media type and
  // encoding type
  instructions.push(
    await inscriptionsProgram.methods
      .migrateToV3()
      .accounts({
        root: mint,
        inscription,
        inscription2: inscription3,
        migrator,
        systemProgram: SystemProgram.programId,
      })
      .instruction()
  );

  data.push({
    instructions,
    description: `Send mint`,
    signers: [],
    blockhash
  });

  console.log({ data });

  return {
    data,
  };
};

export const MigrateToV3TransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IMigrateToV3TransactionButton>,
    "transactionGenerator"
  >
) => {
  const inscription = useMemo(
    () => getInscriptionPda(props.params.root),
    [props]
  )[0];

  return (
    <VStack gap={2}>
      <GenericTransactionButton<IMigrateToV3TransactionButton>
        text={`Migrate`}
        transactionGenerator={migrateToV3}
        onError={(msg) => notify({ message: msg ?? "Unknown error" })}
        size="lg"
        {...props}
        formatting={{ colorScheme: "red" }}
      />
    </VStack>
  );
};
