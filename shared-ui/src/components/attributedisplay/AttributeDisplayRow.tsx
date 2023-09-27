import { Td, Tr } from "@chakra-ui/react";
import { getAttrValue } from "../../sdk/query/metadata/getAttrValue";

import React from "react";
import { IRpcObject } from "../executor";
import { Collection } from "../../sdk/query/metadata/collection";

export const AttributeDisplayRow = ({
  group,
  idx,
  item,
}: {
  group: IRpcObject<Collection>;
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
