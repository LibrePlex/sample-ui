import { MinusIcon } from "@chakra-ui/icons";
import { Box, Button, Tag, Td, Tr } from "@chakra-ui/react";
import { Group } from "query/group";
import { Dispatch, SetStateAction } from "react";

export const getAttrValue = (attr: Group["attributeTypes"][0]["permittedValues"][0]) => {
  return attr.none ? '' 
      :  attr.u8 ?  attr.u8.value
      : attr.i8 ?  attr.i8.value
      : attr.u16 ?  attr.u16.value
      : attr.i16 ?  attr.i16.value
      : attr.u32 ?  attr.u32.value
      : attr.i32 ?  attr.i32.value
      : attr.u64 ?  attr.u64.value.toString()
      : attr.i64 ?  attr.i64.value.toString()
      : attr.word?.value ?? 'Invalid value'
}

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
