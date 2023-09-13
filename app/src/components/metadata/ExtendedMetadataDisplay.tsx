import { Button, Collapse } from "@chakra-ui/react";
import { Group, IRpcObject } from "shared-ui";
import { useState } from "react";
import { AttributesDisplay } from "./AttributesDisplay";

export const NftMetadataDisplay = ({
  attributes,
  collection,
}: {
  collection: IRpcObject<Group>;
  attributes: number[];
}) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <>
      <Button
        onClick={() => {
          setShow((old) => !old);
        }}
      >
        Attributes2
      </Button>
      <Collapse in={show}>
        <AttributesDisplay attributes={attributes} group={collection} />
      </Collapse>
    </>
  );
};
