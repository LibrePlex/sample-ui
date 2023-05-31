import { AddIcon } from "@chakra-ui/icons";

import { Button, ButtonProps } from "@chakra-ui/react";
import { useState } from "react";
import { EditMetadataDialog } from "./EditMetadataDialog";
import { IRpcObject } from "components/executor/IRpcObject";
import { Collection } from "query/collections";

export const AddMetadataButton = ({collection, ...rest}:{collection: IRpcObject<Collection>}&ButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Button
        
        colorScheme="teal"
        variant="outline"
        onClick={() => {
          setOpen(true);
        }}
        {...rest}
      >
        <AddIcon />
      </Button>
      <EditMetadataDialog
        open={open}
        onClose={() => setOpen(false)}
        collection={collection}
      />
    </>
  );
};
