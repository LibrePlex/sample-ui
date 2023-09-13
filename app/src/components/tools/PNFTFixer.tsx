import {
  Box,
  Button,
  Checkbox,
  HStack,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Text,
  Heading,
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useContext, useMemo, useState } from "react";
import { useTokenAccountsByOwner } from "shared-ui";
import { TokenAccountDisplay } from "./TokenAccountDisplay";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useRouter } from "next/router";
import { PublicKey } from "@solana/web3.js";
import { NetworkConfigurationContext } from "shared-ui/src/contexts/NetworkConfigurationProvider";

export const PNFTFixer = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const {networkConfiguration} = useContext(NetworkConfigurationContext)

  const router = useRouter();

  const effectiveWallet = useMemo(() => {
    console.log({w: router.query?.w});
    return (router.query?.w as string) ?? publicKey?.toBase58();
  }, [router.query, publicKey]);

  const key = useMemo(
    () => `tokenaccountbywallet-${effectiveWallet}`,
    [effectiveWallet]
  );
  const { data, refetch, isFetching } = useTokenAccountsByOwner(
    effectiveWallet ? new PublicKey(effectiveWallet) : null,
    connection,
    TOKEN_PROGRAM_ID
  );

  const sortedData = useMemo(
    () =>
      [...data].sort((a, b) =>
        a.pubkey?.toBase58().localeCompare(b.pubkey?.toBase58())
      ),
    [data]
  );
  const [showAll, setShowAll] = useState<boolean>(false);
  return (
    <Box sx={{ height: "100%", pb: "150px" }}>
      <Heading size="md">You are connected to {networkConfiguration}.</Heading>
      <Text>You can switch between localnet/devnet/mainnet in the top right hand corner of the page.</Text>
      <HStack alignItems={"center"}>
        <Button onClick={() => refetch()}>Refresh</Button>
        <Checkbox
          checked={showAll}
          onChange={(e) => {
            setShowAll(e.currentTarget.checked);
          }}
          defaultChecked={showAll}
        >
          Show all mints
        </Checkbox>
      </HStack>
      

      {isFetching && <Spinner />}
      <h5>You have {data.length} mints in your wallet.</h5>
      <Text>
        {showAll
          ? "Showing all mints"
          : "Showing pNFTs in stuck migration state."}
      </Text>
      <TableContainer sx={{ overflow: "auto", height: "100%" }}>
        <Table>
          <Thead>
            <Tr>
              <Th>Mint</Th>
              <Th>Name</Th>
              <Th>Token account</Th>
              <Th>Type</Th>
              <Th>State</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedData.map((item, idx) => (
              <TokenAccountDisplay
                key={idx}
                tokenAccount={item}
                showAll={showAll}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
