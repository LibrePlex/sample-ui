import { Dispatch, SetStateAction } from "react";
import { MinusIcon } from "@chakra-ui/icons";
import { Box, Button, Tag, Td, Tr } from "@chakra-ui/react";
import { Group } from "@libreplex/shared-ui";
import { getAttrValue } from "utils/getAttrValue";





export const AttributeTypeRow = ({
  item,
  setAttributeTypes,
}: {
  item: Group["attributeTypes"][0];
  setAttributeTypes: Dispatch<
    SetStateAction<Group["attributeTypes"]>
  >;
}) => {
  return (
    <Tr>
      <Td>{item.name}</Td>
      <Td>
        <Box display="flex" gap={1} flexWrap={'wrap'}>
          {item.permittedValues.map((val, idx) => (
            <Tag key={idx}>{getAttrValue(val)}</Tag>
          ))}
        </Box>
      </Td>
      <Td>
        <Button
          onClick={() => {
            setAttributeTypes((old) =>
              old.filter((at) => at.name !== item.name)
            );
          }}
          size={"sm"}
          colorScheme="red"
        >
          <MinusIcon />
        </Button>
      </Td>
    </Tr>
  );
};
