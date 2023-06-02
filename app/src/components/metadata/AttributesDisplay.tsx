import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { IRpcObject } from "components/executor/IRpcObject";
import { Collection } from "query/collections";
import { Metadata } from "query/metadata";
import { AttributeDisplayRow } from "./AttributeDisplayRow";

export const AttributesDisplay = ({
  attributes,
  collection,
}: {
  collection: IRpcObject<Collection>;
  attributes: Metadata["nftMetadata"]["attributes"];
}) => {
  return (
    <Table>
      <Thead>
        <Th>Attribute</Th>
        <Th>Value</Th>
      </Thead>
      <Tbody>
       
        {[...attributes].map((item, idx) => 
          <AttributeDisplayRow item={item} idx={idx} collection={collection}/>
        )}
      </Tbody>
    </Table>
  );
};
