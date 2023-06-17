import { Metadata } from "query/metadata";
import { AttributesDisplay } from "./AttributesDisplay";
import { IRpcObject } from "components/executor/IRpcObject";
import { Group } from "query/group";
import { useState } from "react";
import { Button, Collapse } from "@chakra-ui/react";
import { MetadataExtended } from "query/metadataExtension";

export const NftMetadataDisplay = ({
  attributes,
  collection,
}: {
  collection: IRpcObject<Group>;
  attributes: MetadataExtended["attributes"];
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
          attributes={attributes}
          group={collection}
        />
      </Collapse>
    </>
  );
};
