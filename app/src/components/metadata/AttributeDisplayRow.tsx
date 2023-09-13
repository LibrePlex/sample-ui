import { Td, Tr } from "@chakra-ui/react";
import { getAttrValue } from "@app/utils/getAttrValue";
import { Group, IRpcObject } from "shared-ui";

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
      <Td>{group.item.attributeTypes[idx].name}</Td>
      <Td>
        {getAttrValue(group.item.attributeTypes[idx].permittedValues[item])}
      </Td>
    </Tr>
  );
};
