import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    TransactionInstruction
} from "@solana/web3.js";
import BN from "bn.js";

import { VStack } from "@chakra-ui/react";
import {
  Deployment,
    GenericTransactionButton,
    GenericTransactionButtonProps,
    IExecutorParams,
    IRpcObject,
    ITransactionTemplate,
    PROGRAM_ID_INSCRIPTIONS,
    getDeploymentPda,
    getHashlistPda,
    getLegacyMetadataPda,
    getProgramInstanceFairLaunch,
    notify
} from "@libreplex/shared-ui";
import { Validator } from "./useLegacyValidators";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PROGRAM_ID_LEGACY_METADATA } from "../fairlaunch/MintTransactionButton";
import React from "react";

export interface IDeployTransactionButton {
  deployment: IRpcObject<Deployment>;
}

export const generateTransactions = async (
  { wallet, params }: IExecutorParams<IDeployTransactionButton>,
  connection: Connection,
  cluster: string
): Promise<{
  data?: ITransactionTemplate[];
  error?: any;
}> => {
  const data: ITransactionTemplate[] = [];

  const { deployment } = params;

  const fairLaunch = getProgramInstanceFairLaunch(connection, wallet);

  if (!fairLaunch) {
    throw Error("IDL not ready");
  }

  const instructions: TransactionInstruction[] = [];

  const hashlist = getHashlistPda(deployment.pubkey)[0];

  const fungibleMint = Keypair.generate();

  const fungibleEscrowTokenAccount = getAssociatedTokenAddressSync(fungibleMint.publicKey, deployment.pubkey, true);

  const fungibleMetadata = getLegacyMetadataPda(fungibleMint.publicKey)[0];


  instructions.push(
    await fairLaunch.methods
      .deployMigrated()
      .accounts({
        deployment: deployment.pubkey,
        hashlist,
        fungibleMint: fungibleMint.publicKey,
        fungibleMetadata,
        fungibleEscrowTokenAccount,
        payer: wallet.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        inscriptionsProgram: PROGRAM_ID_INSCRIPTIONS,
        metadataProgram: PROGRAM_ID_LEGACY_METADATA,
        sysvarInstructions: new PublicKey(
          "Sysvar1nstructions1111111111111111111111111"
        ),
      })
      .instruction()
  );

  const blockhash = await connection.getLatestBlockhash();

  data.push({
    instructions,
    description: `Deploy migrated`,
    signers: [fungibleMint],
    blockhash,
  });

  console.log({ data });

  return {
    data,
  };
};

export const DeployMigratedTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IDeployTransactionButton>,
    "transactionGenerator"
  >
) => {
  return (
    <VStack gap={2}>
      <GenericTransactionButton<IDeployTransactionButton>
        text={`deploy migrated`}
        transactionGenerator={generateTransactions}
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
