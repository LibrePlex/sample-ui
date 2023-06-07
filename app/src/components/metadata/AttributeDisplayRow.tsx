import { Td, Tr } from "@chakra-ui/react";
import { getAttrValue } from "components/demo/collections/editCollectionDialog/AttributeTypeRow";
import { IRpcObject } from "components/executor/IRpcObject";
import { Group } from "query/group";

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
