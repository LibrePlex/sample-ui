import { Td, Tr } from "@chakra-ui/react";
import { getAttrValue } from "../../sdk/query/metadata/getAttrValue";

import React from "react";
import { IRpcObject } from "../executor";
import { Group } from "../../sdk/query/metadata/group";

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
      <Td>{(group.item as any).attributeTypes[idx].name}</Td>
      <Td>
        {getAttrValue((group.item as any).attributeTypes[idx].permittedValues[item])}
      </Td>
    </Tr>
  );
};
