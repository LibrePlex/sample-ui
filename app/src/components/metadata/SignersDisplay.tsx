import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { IRpcObject } from "components/executor/IRpcObject";
import { Group } from "query/group";
import { Metadata } from "query/metadata";
import { AttributeDisplayRow } from "./AttributeDisplayRow";
import { MetadataExtended } from "query/metadataExtension";
import { CopyPublicKeyButton } from "components/buttons/CopyPublicKeyButton";

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
