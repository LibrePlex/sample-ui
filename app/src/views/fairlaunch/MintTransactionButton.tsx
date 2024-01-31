import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";

import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
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
  notify,
} from "@libreplex/shared-ui";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { getHashlistMarkerPda } from "@libreplex/shared-ui/src/anchor/fair_launch/pdas/getHashlistMarkerPda";
import React, { useMemo } from "react";
import { getDeploymentConfigPda } from "shared-ui/src/anchor/fair_launch/pdas/getDeploymentConfigPda";
import { DeploymentConfig } from "shared-ui/src/anchor/fair_launch/accounts";
import { InfoIcon } from "@chakra-ui/icons";

export const PROGRAM_ID_LEGACY_METADATA = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export interface IDeployTransactionButton {
  deployment: IRpcObject<Deployment>;
  deploymentConfig: IRpcObject<DeploymentConfig> | undefined;
}

export const DEPLOYMENT_TYPE_HYBRID = 4;
export const DEPLOYMENT_TYPE_2022 = 3;
export const DEPLOYMENT_TYPE_LEGACY = 0;

export const mint = async (
  { wallet, params }: IExecutorParams<IDeployTransactionButton>,
  connection: Connection,
  cluster: string
): Promise<{
  data?: ITransactionTemplate[];
  error?: any;
}> => {
  const data: ITransactionTemplate[] = [];

  const { deployment, deploymentConfig } = params;

  const token22 = deployment.item.deploymentType === DEPLOYMENT_TYPE_2022;

  const tokenProgram = token22 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;

  const fairLaunch = getProgramInstanceFairLaunch(connection, wallet);

  if (!fairLaunch) {
    throw Error("IDL not ready");
  }

  const instructions: TransactionInstruction[] = [];

  const nonFungibleMint = Keypair.generate();

  const hashlist = getHashlistPda(deployment.pubkey)[0];

  const hashlistMarker = getHashlistMarkerPda(
    deployment.pubkey,
    nonFungibleMint.publicKey
  )[0];

  const fungibleMint = deployment.item.fungibleMint;

  const fungibleMetadata = getLegacyMetadataPda(fungibleMint)[0];

  const nonFungibleMetadata = getLegacyMetadataPda(
    nonFungibleMint.publicKey
  )[0];
  const nonFungibleMasteredition = getMasterEditionPda(
    nonFungibleMint.publicKey
  )[0];

  const nonFungibleTokenAccount = getAssociatedTokenAddressSync(
    nonFungibleMint.publicKey,
    wallet.publicKey,
    false,
    tokenProgram
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
  if (deployment.item.deploymentType === DEPLOYMENT_TYPE_2022) {
    if (!deploymentConfig?.item) {
      throw Error("Deployment config not specified - v2 needs this");
    }

    instructions.push(
      await fairLaunch.methods
        .mintToken22()
        .accounts({
          deployment: deployment.pubkey,
          deploymentConfig: deploymentConfig.pubkey,
          payer: wallet.publicKey,
          signer: wallet.publicKey,
          minter: wallet.publicKey,
          fungibleMint,
          hashlist,
          hashlistMarker,
          nonFungibleMint: nonFungibleMint.publicKey,
          nonFungibleTokenAccount,
          inscriptionSummary,
          inscriptionV3,
          inscriptionData,
          creatorFeeTreasury: deploymentConfig.item.creatorFeeTreasury,
          tokenProgram,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          inscriptionsProgram: PROGRAM_ID_INSCRIPTIONS,
          systemProgram: SystemProgram.programId,
        })
        .instruction()
    );
  } else {
    const fungibleTokenAccountEscrow = getAssociatedTokenAddressSync(
      fungibleMint,
      deployment.pubkey,
      true,
      tokenProgram
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
          hashlistMarker,
          nonFungibleMint: nonFungibleMint.publicKey,
          nonFungibleMetadata,
          nonFungibleMasteredition,
          nonFungibleTokenAccount,
          fungibleTokenAccountEscrow,
          inscriptionSummary,
          inscription,
          inscriptionV3,
          inscriptionData,
          tokenProgram,
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
  }

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
  const feeInSol = useMemo(
    () =>
      Number(
        props.params.deploymentConfig?.item?.creatorFeePerMintLamports.toNumber() ??
          0
      ) /
      10 ** 9,
    [props.params]
  );

  return (
    <VStack gap={2}>
      <GenericTransactionButton<IDeployTransactionButton>
        text={`Mint`}
        multiUse={true}
        transactionGenerator={mint}
        onError={(msg) =>
          notify({ message: msg ?? "Unknown error", type: "error" })
        }
        size="lg"
        {...props}
        formatting={{ colorScheme: "red" }}
      />
      {feeInSol > 0 && <Text>Creator fee: {feeInSol.toFixed(2)} SOL per mint</Text>}
      {props.params.deployment.item.deploymentType === DEPLOYMENT_TYPE_2022 && (
        <HStack>
          <Text>NB: Token-2022 deployment</Text>
          <Popover size="md">
            <PopoverTrigger>
              <Button colorScheme="white" variant="outline">
                <InfoIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>
                <Flex justify="space-between" align="center" p={2}>
                  <Box>
                    <Text as="b">Token-2022</Text>
                  </Box>
                </Flex>
              </PopoverHeader>
              <Box p={5}>
                <Center>
                  <VStack align={"start"}>
                      <Text>
                        Token-2022 (aka Token Extensions) is the new Solana
                        contract that governs token ownership. It has numerous
                        improvements over the old standard including:
                      </Text>
                    <UnorderedList>
                      <ListItem>Support for native metadata</ListItem>
                      <ListItem>Transfer hooks</ListItem>
                      <ListItem>
                        Native support for groups / collections
                      </ListItem>
                    </UnorderedList>
                    <Text>
                        However, marketplace -2022 (aka Token Extensions) is the new Solana
                        contract that governs token ownership. It has numerous
                        improvements over the old standard including:
                      </Text>
                  </VStack>
                </Center>
              </Box>
            </PopoverContent>
          </Popover>
        </HStack>
      )}
    </VStack>
  );
};
