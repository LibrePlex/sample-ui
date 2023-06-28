import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { IRpcObject } from "@/components/executor/IRpcObject";
import { Group } from "shared-ui";
import { Metadata } from "shared-ui";
import { AttributeDisplayRow } from "./AttributeDisplayRow";
import { MetadataExtended } from "shared-ui";

export const AttributesDisplay = ({
  attributes,
  group,
}: {
  group: IRpcObject<Group>;
  attributes: MetadataExtended["attributes"];
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
