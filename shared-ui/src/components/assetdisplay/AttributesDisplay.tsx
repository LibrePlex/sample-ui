import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Collection } from "../../sdk";

import { AttributeDisplayRow } from "./AttributeDisplayRow";
import React from "react";
import { IRpcObject } from "..";

export const AttributesDisplay = ({
  attributes,
  group,
}: {
  group: IRpcObject<Collection>;
  attributes: number[];
}) => {
  return group ? (
    // <Box sx={{ 
    //   display: "flex",
    //   flexDir: "column",
    //   justifyContent: "start",
    //   overflow: "auto", 
    //   h: "100%",
    //    maxH: "100%", 
    //    maxW: "250px" }}>
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
