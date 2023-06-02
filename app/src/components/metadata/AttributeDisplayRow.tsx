import { Td, Tr } from "@chakra-ui/react";
import { IRpcObject } from "components/executor/IRpcObject";
import { Collection } from "query/collections";

export const AttributeDisplayRow = ({collection, idx, item}:{collection: IRpcObject<Collection>, idx: number, item: number}) => {
  return (
    <Tr>
      <Td>{collection.item.nftCollectionData.attributeTypes[idx].name}</Td>
      <Td>
        {
          collection.item.nftCollectionData.attributeTypes[idx].permittedValues[
            item
          ]
        }
      </Td>
    </Tr>
  );
};
