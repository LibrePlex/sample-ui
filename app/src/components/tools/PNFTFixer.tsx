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
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMemo, useState } from "react";
import { useTokenAccountsByOwner } from "shared-ui";
import { TokenAccountDisplay } from "./TokenAccountDisplay";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const PNFTFixer = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const key = useMemo(
    () => `tokenaccountbywallet-${publicKey?.toBase58()}`,
    [publicKey]
  );
  const { data, refetch, isFetching } = useTokenAccountsByOwner(
    publicKey,
    connection,
    TOKEN_PROGRAM_ID,
    key
  );

  const sortedData = useMemo(
    () =>
      [...data].sort((a, b) =>
        a.pubkey.toBase58().localeCompare(b.pubkey.toBase58())
      ),
    [data]
  );
  const [showAll, setShowAll] = useState<boolean>(false);
  return (
    <Box sx={{ height: "100%", pb: "150px" }}>
      <HStack alignItems={'center'}>
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
      <h5>
        You have {data.length} mints in your wallet. Only pNFTs in stuck
        migration state are displayed below.
      </h5>
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
              <TokenAccountDisplay key={idx} tokenAccount={item} showAll={showAll}/>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
