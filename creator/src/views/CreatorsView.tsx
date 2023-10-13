import {
  Box,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useMediaQuery,
  Text,
  Button,
  VStack,
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { CopyPublicKeyButton } from "@libreplex/shared-ui";
import { useCreatorsByAuthority } from "@libreplex/shared-ui";

export const CreatorsView = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const { data } = useCreatorsByAuthority(publicKey, connection);
  const [isSmallerThan800] = useMediaQuery("(max-width: 800px)");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      rowGap={3}
    >
      <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-10 pb-5">
        Your Creators
      </h1>
      <VStack p={3} rowGap={2} display='flex'>
        <Text>This page shows all creators you hold update authority on.</Text>
        <Button>Create</Button>
      </VStack>

      <Box
        display="flex"
        flexDirection={isSmallerThan800 ? "column" : "row"}
        justifyContent={"center"}
        columnGap={2}
        w={[300, 300, 800]}
      >
        <Table>
          {" "}
          <Thead>
            <Tr>
              <Th>Creator id</Th>
            </Tr>
          </Thead>
          <Tbody>
            {publicKey ? data.length > 0 ? (
              data.map((item) => (
                <Tr>
                  <Td>
                    <CopyPublicKeyButton publicKey={item.pubkey.toBase58()} />
                  </Td>
                </Tr>
              ))
            ) : (
              <Text p={3}>No creators</Text>
            ) : <Text p={3}>Please connect your wallet</Text>}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};
