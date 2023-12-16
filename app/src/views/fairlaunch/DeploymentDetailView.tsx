import { Button, HStack, Heading, Image, VStack, Text } from "@chakra-ui/react";
import {
  CopyPublicKeyButton,
  FairLaunchProgramContext,
  HttpClient,
  IOffchainJson,
  getHashlistPda,
  useDeploymentById,
  useFetchSingleAccount,
} from "@libreplex/shared-ui";
import NextLink from "next/link";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DeployTransactionButton } from "./DeployTransactionButton";
import { SwapArea } from "./SwapArea";
import { decodeHashlist } from "@libreplex/shared-ui";
import { DeployMigratedTransactionButton } from "../legacyImporter/DeployMigratedTransactionButton";
import React from "react";

export const DeploymentDetailView = () => {
  const router = useRouter();
  const deploymentId = useMemo(
    () =>
      router.query.deploymentId
        ? new PublicKey(router.query.deploymentId as string)
        : null,
    [router.query]
  );

  const { connection } = useConnection();
  const { data: deployment, refetch } = useDeploymentById(
    deploymentId,
    connection
  );

  const [imageUrl, setImageUrl] = useState<string>();
  useEffect(() => {
    let active = true;
    (async () => {
      const httpClient = new HttpClient("");
      const { data } = await httpClient.get<IOffchainJson>(
        deployment?.item?.offchainUrl ?? ""
      );
      active && setImageUrl(data?.image);
    })();
    return () => {
      active = false;
    };
  }, [deployment?.item?.offchainUrl]);

  const { publicKey } = useWallet();

  const hashlistPda = useMemo(
    () => (deployment ? getHashlistPda(deployment.pubkey)[0] : null),
    [deployment]
  );

  const { data } = useFetchSingleAccount(hashlistPda, connection);

  const { program } = useContext(FairLaunchProgramContext);

  const download = useCallback(() => {
    const vals = decodeHashlist(program)(data?.item?.buffer, data?.pubkey);

    if (vals?.item) {
      // Create dummy <a> element using JavaScript.
      var hidden_a = document.createElement("a");

      // add texts as a href of <a> element after encoding.
      hidden_a.setAttribute(
        "href",
        "data:application/json;charset=utf-8, " +
          encodeURIComponent(
            JSON.stringify(vals.item.issues.map((item) => item.mint.toBase58()))
          )
      );

      // also set the value of the download attribute
      hidden_a.setAttribute("download", "text_file");
      document.body.appendChild(hidden_a);

      // click the link element
      hidden_a.click();
      document.body.removeChild(hidden_a);
    }
  }, [data?.item?.buffer, data?.pubkey, program]);

  return (
    <VStack>
      <Heading>{deployment?.item?.ticker}</Heading>

      <HStack className="gap-x-20">
        <VStack p={2} className="border-2 rounded-lg">
          <Image height="200px" aspectRatio="1/1" src={imageUrl} />
        </VStack>
        <VStack p={2}>
          <Button
            onClick={() => {
              download();
            }}
          >
            Download hashlist
          </Button>
          <NextLink
            href={`https://v1.orca.so/liquidity/browse?tokenMint=${deployment?.item?.fungibleMint?.toBase58()}`}
          >
            <Image width="120px" src="/orca-logo.svg" />
          </NextLink>
          {deployment?.item && (
            <CopyPublicKeyButton
              publicKey={deployment?.item?.fungibleMint?.toBase58()}
            />
          )}
        </VStack>
      </HStack>
      <Text>{deployment?.item?.mintTemplate}</Text>
      
      {deployment?.item && <SwapArea deployment={deployment} />}
      
    </VStack>
  );
};
