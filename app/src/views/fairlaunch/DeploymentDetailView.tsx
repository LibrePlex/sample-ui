import { Button, HStack, Heading, Image, VStack } from "@chakra-ui/react";
import {
  CopyPublicKeyButton,
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
// import { DeployMigratedTransactionButton } from "../legacyImporter/DeployMigratedTransactionButton";
import { FairLaunchProgramContext, decodeHashlist } from "shared-ui/src/anchor";
import { DeployMigratedTransactionButton } from "../legacyImporter/DeployMigratedTransactionButton";

export const DeploymentDetailView = () => {
  const router = useRouter();
  const deploymentId = useMemo(
    () =>
      router.query.deploymentId
        ? new PublicKey(router.query.deploymentId as string)
        : undefined,
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
        deployment?.item?.offchainUrl
      );
      active && setImageUrl(data?.image);
    })();
    return () => {
      active = false;
    };
  }, [deployment?.item?.offchainUrl]);

  const { publicKey } = useWallet();

  const hashlistPda = useMemo(
    () => (deployment ? getHashlistPda(deployment.pubkey)[0] : undefined),
    [deployment]
  );

  const { data } = useFetchSingleAccount(hashlistPda, connection);

  const { program } = useContext(FairLaunchProgramContext);

  const download = useCallback(() => {
    const vals = decodeHashlist(program)(data?.item?.buffer, data?.pubkey);

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
  }, [data?.item?.buffer, data?.pubkey, program]);

  return (
    <VStack>
      <Heading>{deployment?.item?.ticker}</Heading>
      {deployment?.item && (
        <CopyPublicKeyButton
          publicKey={deployment?.item?.fungibleMint?.toBase58()}
        />
      )}

      <HStack>
        <Image height="200px" aspectRatio="1/1" src={imageUrl} />
        {!deployment?.item.deployed && (
          <DeployTransactionButton params={undefined} formatting={undefined} />
        )}
        <VStack>
          <Button
            onClick={() => {
              download();
            }}
          >
            Download hashlist
          </Button>
          {process.env.NEXT_PUBLIC_DISPLAY_DEPLOY_MIGRATED && (
            <DeployMigratedTransactionButton
              params={{ deployment }}
              formatting={undefined}
            />
          )}
          <NextLink
            href={`https://v1.orca.so/liquidity/browse?tokenMint=${deployment?.item?.fungibleMint?.toBase58()}`}
          >
            <Image width="120px" src="/orca-logo.svg"/>
          </NextLink>
        </VStack>
      </HStack>
      {deployment?.item && <SwapArea deployment={deployment} />}
    </VStack>
  );
};
