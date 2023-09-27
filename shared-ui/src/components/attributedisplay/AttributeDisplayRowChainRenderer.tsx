import { Td, Tr } from "@chakra-ui/react";
import { getAttrValue } from "../../sdk/query/metadata/getAttrValue";

import React from "react";
import { IRpcObject } from "../executor";
import { Collection } from "../../sdk/query/metadata/collection";

export const AttributeDisplayRowChainRenderer = ({
  name,
  value,
}: {
  name: string;
  value: string;
}) => {
  return (
    <Tr>
      <Td>{name}</Td>
      <Td>{value}</Td>
    </Tr>
  );
};
