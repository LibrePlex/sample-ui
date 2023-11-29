import { Heading, Image, VStack, Text, Button } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  CopyPublicKeyButton,
  HttpClient,
  IOffchainJson,
  decodeDeployment,
  getHashlistPda,
  useDeploymentById,
  useFetchSingleAccount,
} from "@libreplex/shared-ui";
import { DeployTransactionButton } from "./DeployTransactionButton";
import { RefetchButton } from "@app/components/RefetchButton";
import { SwapArea } from "./SwapArea";
import { useMint } from "@libreplex/shared-ui";
import { DeployMigratedTransactionButton } from "../legacyImporter/DeployMigratedTransactionButton";
import { FairLaunchProgramContext, decodeHashlist } from "shared-ui/src/anchor";

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
    () => deployment ? getHashlistPda(deployment.pubkey)[0] : undefined,
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
          JSON.stringify(vals.item.issues.map((item) => item.mint.toBase58())),
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
      <Button onClick={()=>{
        download()
      }}>Download hashlist</Button>
      {publicKey?.toBase58().startsWith("4aAifU9ck88koMhSK") && (
        <DeployMigratedTransactionButton
          params={{
            deployment,
          }}
          formatting={{}}
        />
      )}
      <Image height="200px" aspectRatio="1/1" src={imageUrl} />
      {!deployment?.item.deployed && (
        <DeployTransactionButton params={undefined} formatting={undefined} />
      )}
      {deployment?.item.deployed && <Heading size="sm">Deployed</Heading>}
      <RefetchButton refetch={refetch} />
      {deployment?.item && <SwapArea deployment={deployment} />}
    </VStack>
  );
};
