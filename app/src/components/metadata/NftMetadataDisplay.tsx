import { Metadata } from "query/metadata";
import { AttributesDisplay } from "./AttributesDisplay";
import { IRpcObject } from "components/executor/IRpcObject";
import { Collection } from "query/collections";
import { useState } from "react";
import { Button, Collapse } from "@chakra-ui/react";

export const NftMetadataDisplay = ({
  nftMetadata,
  collection,
}: {
  collection: IRpcObject<Collection>;
  nftMetadata: Metadata["nftMetadata"];
}) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <>
      <Button
        onClick={() => {
          setShow((old) => !old);
        }}
      >
        Attributes
      </Button>
      <Collapse in={show}>
        <AttributesDisplay
          attributes={nftMetadata["attributes"]}
          collection={collection}
        />
      </Collapse>
    </>
  );
};
