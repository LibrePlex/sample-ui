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

export const PROGRAM_ID_LEGACY_METADATA = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

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

  const nonFungibleMint = Keypair.generate();

  const hashlist = getHashlistPda(deployment.pubkey)[0];

  const fungibleMint = deployment.item.fungibleMint;

  const fungibleMetadata = getLegacyMetadataPda(fungibleMint)[0];

  const nonFungibleMetadata = getLegacyMetadataPda(
    nonFungibleMint.publicKey
  )[0];
  const nonFungibleMasteredition = getMasterEditionPda(
    nonFungibleMint.publicKey
  )[0];

  const fungibleTokenAccountEscrow = getAssociatedTokenAddressSync(
    fungibleMint,
    deployment.pubkey,
    true
  );

  const nonFungibleTokenAccount = getAssociatedTokenAddressSync(
    nonFungibleMint.publicKey,
    wallet.publicKey
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
      .mintLegacy()
      .accounts({
        deployment: deployment.pubkey,
        payer: wallet.publicKey,
        inscriber: wallet.publicKey,
        fungibleMint,
        hashlist,
        nonFungibleMint: nonFungibleMint.publicKey,
        nonFungibleMetadata,
        nonFungibleMasteredition,
        nonFungibleTokenAccount,
        fungibleTokenAccountEscrow,
        inscriptionSummary,
        inscription,
        inscriptionV3,
        inscriptionData,
        tokenProgram: TOKEN_PROGRAM_ID,
        metadataProgram: PROGRAM_ID_LEGACY_METADATA,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        inscriptionsProgram: PROGRAM_ID_INSCRIPTIONS,
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
    description: `Create deployment`,
    signers: [nonFungibleMint],
    blockhash,
  });

  console.log({ data });

  return {
    data,
  };
};

export const MintTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IDeployTransactionButton>,
    "transactionGenerator"
  >
) => {
  return (
    <VStack gap={2}>
      <GenericTransactionButton<IDeployTransactionButton>
        text={`Mint`}
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
