import { Button, Collapse } from "@chakra-ui/react";
import { IRpcObject } from "@/components/executor/IRpcObject";
import { Group } from "shared-ui";
import { MetadataExtended } from "shared-ui";
import { useState } from "react";
import { AttributesDisplay } from "./AttributesDisplay";

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
        <AttributesDisplay attributes={attributes} group={collection} />
      </Collapse>
    </>
  );
};
