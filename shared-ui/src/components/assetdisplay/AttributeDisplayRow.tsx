import { Td, Tr } from "@chakra-ui/react";
import { getAttrValue } from "../../sdk/query/metadata/getAttrValue";
import { Group, IRpcObject } from "shared-ui";
import React from "react";

export const AttributeDisplayRow = ({
  group,
  idx,
  item,
}: {
  group: IRpcObject<Group>;
  idx: number;
  item: number;
}) => {
  return (
    <Tr>
      <Td>{group.item.attributeTypes[idx].name}</Td>
      <Td>
        {getAttrValue(group.item.attributeTypes[idx].permittedValues[item])}
      </Td>
    </Tr>
  );
};
