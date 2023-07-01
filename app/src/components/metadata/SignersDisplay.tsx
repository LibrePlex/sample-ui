import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { CopyPublicKeyButton, IRpcObject } from "shared-ui";
import { Group } from "shared-ui";

export const SignersDisplay = ({
  signers,
  group,
}: {
  group: IRpcObject<Group>;
  signers: PublicKey[];
}) => {
  return group ? (
    <Table>
      <Thead>
        <Th>Signer</Th>
      </Thead>
      <Tbody>
        {signers.length === 0 ? (
          <Tr>
            <Td>
              <Box p={2}>This metadata has not yet been signed by anybody.</Box>
            </Td>
          </Tr>
        ) : (
          signers.map((item, idx) => (
            <Tr key={idx}>
              <Td>
                <CopyPublicKeyButton publicKey={item.toBase58()} />
              </Td>
            </Tr>
          ))
        )}
      </Tbody>
    </Table>
  ) : (
    <></>
  );
};
