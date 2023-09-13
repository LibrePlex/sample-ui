import { AddIcon } from "@chakra-ui/icons";

import { Button, ButtonProps } from "@chakra-ui/react";
import { useState } from "react";
import { EditMetadataDialog } from "./EditMetadataDialog";

import { Group, IRpcObject } from  "@libreplex/shared-ui";
import React from "react";

export const AddMetadataButton = ({
  collection,
  ...rest
}: { collection: IRpcObject<Group> } & ButtonProps) => {
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
      {collection && (
        <EditMetadataDialog
          open={open}
          onClose={() => setOpen(false)}
          collection={collection}
        />
      )}
    </>
  );
};
