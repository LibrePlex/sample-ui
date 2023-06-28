import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { CopyPublicKeyButton } from "shared-ui";
import { IRpcObject } from "@/components/executor/IRpcObject";
import { Group } from "shared-ui";
import { MetadataExtended } from "shared-ui";

export const SignersDisplay = ({
  signers,
  group,
}: {
  group: IRpcObject<Group>;
  signers: MetadataExtended["signers"];
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
