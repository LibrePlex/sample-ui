import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction
} from "@solana/web3.js";

import { VStack } from "@chakra-ui/react";
import {
  Deployment,
  GenericTransactionButton,
  GenericTransactionButtonProps,
  IExecutorParams,
  IRpcObject,
  ITransactionTemplate,
  PROGRAM_ID_INSCRIPTIONS,
  getHashlistPda,
  getInscriptionDataPda,
  getInscriptionPda,
  getInscriptionSummaryPda,
  getInscriptionV3Pda,
  getLegacyMetadataPda,
  getMasterEditionPda,
  getProgramInstanceFairLaunch,
  notify
} from "@libreplex/shared-ui";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { PROGRAM_ID_LEGACY_METADATA } from "./MintTransactionButton";

export interface IDeployTransactionButton {
  deployment: IRpcObject<Deployment>;
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

  const { deployment } = params;

  const fairLaunch = getProgramInstanceFairLaunch(connection, wallet);

  if (!fairLaunch) {
    throw Error("IDL not ready");
  }

  const instructions: TransactionInstruction[] = [];

  const fungibleMint = Keypair.generate();
  const nonFungibleMint = Keypair.generate();

  const hashlist = getHashlistPda(deployment.pubkey)[0];

  const fungibleMetadata = getLegacyMetadataPda(fungibleMint.publicKey)[0];

  const nonFungibleMetadata = getLegacyMetadataPda(
    nonFungibleMint.publicKey
  )[0];
  const nonFungibleMasterEdition = getMasterEditionPda(
    nonFungibleMint.publicKey
  )[0];

  const fungibleEscrowTokenAccount = getAssociatedTokenAddressSync(
    fungibleMint.publicKey,
    deployment.pubkey,
    true
  );

  const nonFungibleEscrowTokenAccount = getAssociatedTokenAddressSync(
    nonFungibleMint.publicKey,
    deployment.pubkey,
    true
  );

  const inscriptionSummary = getInscriptionSummaryPda()[0];
  const inscription = getInscriptionPda(nonFungibleMint.publicKey)[0];
  const inscriptionV3 = getInscriptionV3Pda(nonFungibleMint.publicKey)[0];
  const inscriptionData = getInscriptionDataPda(nonFungibleMint.publicKey)[0];

  instructions.push(
    ComputeBudgetProgram.setComputeUnitLimit({
      units: 600000,
    })
  );

  instructions.push(
    await fairLaunch.methods
      .deployLegacy()
      .accounts({
        deployment: deployment.pubkey,
        hashlist,
        payer: wallet.publicKey,
        fungibleMint: fungibleMint.publicKey,
        fungibleEscrowTokenAccount,
        fungibleMetadata,

        nonFungibleMint: nonFungibleMint.publicKey,
        nonFungibleMetadata,
        nonFungibleMasterEdition,
        nonFungibleTokenAccount: nonFungibleEscrowTokenAccount,

        inscriptionSummary,
        inscription,
        inscriptionV3,
        inscriptionData,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        inscriptionsProgram: PROGRAM_ID_INSCRIPTIONS,
        systemProgram: SystemProgram.programId,
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
    description: `Create deployment`,
    signers: [fungibleMint, nonFungibleMint],
    blockhash,
  });

  console.log({ data });

  return {
    data,
  };
};

export const DeployTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IDeployTransactionButton>,
    "transactionGenerator"
  >
) => {
  return (
    <VStack gap={2}>
      <GenericTransactionButton<IDeployTransactionButton>
        text={`Deploy`}
        transactionGenerator={launchDeployment}
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
