import { Box, Table, Td, Text, Thead } from "@chakra-ui/react";
import { IRpcObject } from "components/executor/IRpcObject";
import { Collection } from "query/collections";
import { Dispatch, SetStateAction, useMemo } from "react";
import { AttributeSelectorRow } from "./AttributeSelectorRow";

export const AttributeSelectorPanel = ({
  attributes,
  setAttributes,
  collection,
}: {
  attributes: number[];
  setAttributes: Dispatch<SetStateAction<number[]>>;
  collection: IRpcObject<Collection>;
}) => {
  const attributeCount = useMemo(
    () => collection?.item?.nftCollectionData?.attributeTypes?.length ?? 0,
    [collection]
  );
  return (
    <Box p={2}>
      <Text>
        {attributeCount > 0
          ? `This collection has ${attributeCount} attribute${attributeCount===1?'':'s'}. Select ${attributeCount===1?'it':'them'} below.`
          : "This collection has no available attributes."}
      </Text>
      {attributeCount >0 && (
        <Table>
          <Thead>
            <Td>Attribute Type</Td>
            <Td>Attribute Value</Td>
          </Thead>
          {collection?.item?.nftCollectionData?.attributeTypes?.map(
            (item, idx) => (
              <AttributeSelectorRow
                key={idx}
                attributeTypeIdx={idx}
                attributeType={item}
                attributes={attributes}
                setAttributes={setAttributes}
              />
            )
          )}
        </Table>
      )}
    </Box>
  );
};
