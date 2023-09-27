import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Collection } from "../../sdk";

import { AttributeDisplayRow } from "./AttributeDisplayRow";
import React from "react";
import { IRpcObject } from "..";

export const AttributesDisplayDefault = ({
  attributes,
  group,
}: {
  group: IRpcObject<Collection>;
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
            <AttributeDisplayRow
              key={idx}
              item={item}
              idx={idx}
              group={group}
            />
          ))}
        </Tbody>
      </Table>
    // </Box>
  ) : (
    <></>
  );
};
