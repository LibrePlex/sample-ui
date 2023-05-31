import { Box, Button, Tag, Td, Tr } from "@chakra-ui/react";
import { Collection } from "query/collections";
import { Dispatch, SetStateAction } from "react";

export const AttributeSelectorRow = ({
  attributeType,
  attributeTypeIdx,
  attributes,
  setAttributes,
}: {
  attributeTypeIdx: number;
  attributes: number[];
  setAttributes: Dispatch<SetStateAction<number[]>>;
  attributeType: Collection["nftCollectionData"]["attributeTypes"][0];
}) => {
  return (
    <Tr>
      <Td>{attributeType.name}</Td>
      <Td>
        <Box display="flex" gap={1} flexWrap={'wrap'}>
          <Button onClick={()=>{
                setAttributes((old) => [
                    ...old.map((item: number, idx: number) =>
                      idx === attributeTypeIdx ? 0 : item
                    ),
                  ]);
          }}
           size="sm">None</Button>
          {attributeType.permittedValues.map((item, valueIdx) => (
            <Button
            key={valueIdx}
                colorScheme="teal"
              variant={
                attributes[attributeTypeIdx]  === valueIdx + 1? "solid" : "outline"
              }
              onClick={() => {
                setAttributes((old) => [
                  ...old.map((item: number, idx: number) =>
                    idx === attributeTypeIdx ? valueIdx + 1: item
                  ),
                ]);
              }}
              size="sm"
              sx={{ cursor: "pointer" }}
            >
              {item}
            </Button>
          ))}
        </Box>
      </Td>
    </Tr>
  );
};
