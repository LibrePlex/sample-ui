import { Box, Table, Tbody, Td, Text, Thead } from "@chakra-ui/react";
import { IRpcObject, Group } from "@libreplex/shared-ui";
import { Dispatch, SetStateAction, useMemo } from "react";
import { AttributeSelectorRow } from "./AttributeSelectorRow";
import React from "react";

export const AttributeSelectorPanel = ({
  attributes,
  setAttributes,
  collection,
}: {
  attributes: number[];
  setAttributes: Dispatch<SetStateAction<number[]>>;
  collection: IRpcObject<Group>;
}) => {
  const attributeCount = useMemo(
    () => collection?.item?.attributeTypes?.length ?? 0,
    [collection]
  );
  return (
    <Box p={2}>
      <Text>
        {attributeCount > 0
          ? `This collection has ${attributeCount} attribute${
              attributeCount === 1 ? "" : "s"
            }. Select ${attributeCount === 1 ? "it" : "them"} below.`
          : "This collection has no available attributes."}
      </Text>
      {attributeCount > 0 && (
        <Table>
          <Thead>
            <Td>Type</Td>
            <Td>Value</Td>
          </Thead>
          <Tbody>
            {collection?.item?.attributeTypes?.map((item, idx) => (
              <AttributeSelectorRow
                key={idx}
                attributeTypeIdx={idx}
                attributeType={item}
                attributes={attributes}
                setAttributes={setAttributes}
              />
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};
