import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Group, IRpcObject } from "shared-ui";
import { Metadata } from "shared-ui";
import { AttributeDisplayRow } from "./AttributeDisplayRow";

export const AttributesDisplay = ({
  attributes,
  group,
}: {
  group: IRpcObject<Group>;
  attributes: number[];
}) => {
  return group ? (
    <Table>
      <Thead>
        <Tr>
          <Th>Attribute</Th>
          <Th>Value</Th>
        </Tr>
      </Thead>
      <Tbody>
        {[...attributes].map((item, idx) => (
          <AttributeDisplayRow key={idx} item={item} idx={idx} group={group} />
        ))}
      </Tbody>
    </Table>
  ) : (
    <></>
  );
};
