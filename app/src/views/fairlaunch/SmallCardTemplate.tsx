import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Table,
  Td,
  Text,
  Th,
  Tr
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import NextLink from "next/link";
import { GrLinkNext } from "react-icons/gr";
import {
  getHashlistPda,
  useCluster,
  useDeploymentById,
  useHashlistById,
  useLegacyMetadataByMintId,
  useOffChainMetadataFromUrl
} from "@libreplex/shared-ui";
import { DeployTransactionButton } from "./DeployTransactionButton";
import { SetTokensTransactionButton } from "./SetAmountTransactionButton";
import { useMemo } from "react";

export const SmallCardTemplate = ({
  deploymentPublicKey,
}: {
  deploymentPublicKey: PublicKey;
}) => {
  const { connection } = useConnection();
  const { data } = useDeploymentById(deploymentPublicKey, connection);

  const hashlistId = useMemo(
    () => (deploymentPublicKey ? getHashlistPda(deploymentPublicKey)[0] : null),
    [deploymentPublicKey]
  );


  const {data: hashlist} = useHashlistById(hashlistId, connection);

  const { data: metadata } = useLegacyMetadataByMintId(
    data?.item?.fungibleMint,
    connection
  );

  const { cluster } = useCluster();
  const { publicKey } = useWallet();

  const { data: offchainData } = useOffChainMetadataFromUrl(
    data?.item?.offchainUrl ?? ""
  );
  return (
    <Card>
      <CardHeader>
        <Flex>
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar
              name={data?.item?.ticker ?? ""}
              src={offchainData?.image ?? ""}
            />

            <Box>
              <Heading size="sm">{metadata?.item?.data.name ?? ""}</Heading>
              <Text>[{data?.item?.ticker ?? ""}]</Text>
            </Box>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody>
        <Table>
          <Tr>
            <Th p={1}>Tokens</Th>
            <Td>
              <Text>
                {data?.item?.numberOfTokensIssued.toLocaleString()} /{" "}
                {data?.item?.maxNumberOfTokens.toLocaleString()}
              </Text>
            </Td>
          </Tr>
          {/* <Tr>
            <Th p={1} colSpan={2}>
              Inscription
            </Th>
          </Tr>
          <Tr>
            <Td colSpan={2}>
              <Text className="break-all">{data?.item?.mintTemplate}</Text>
            </Td>
          </Tr> */}
        </Table>
      </CardBody>

      <CardFooter
        justify="end"
        flexWrap="wrap"
        sx={{
          "& > button": {
            minW: "136px",
          },
        }}
      >
        {hashlist ? (
          <NextLink
            href={`/fairlaunch/deployments/${deploymentPublicKey.toBase58()}${
              cluster === "devnet" ? "?env=devnet" : ""
            }`}
          >
            <Button flex="1" variant="solid" leftIcon={<GrLinkNext />}>
              Select
            </Button>
          </NextLink>
        ) : publicKey?.toBase58() === data?.item?.creator.toBase58() ? (
          <DeployTransactionButton
            params={{ deployment: data }}
            formatting={{}}
            disableSuccess={false}
          />
        ) : (
          <Text>Not deployed</Text>
        )}
        {/* <SetTokensTransactionButton
          params={{ deploymentPublicKey }}
          formatting={{}}
        /> */}
      </CardFooter>
    </Card>
  );
};
