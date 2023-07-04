import { Box } from "@chakra-ui/react";
import React from "react";
import { IRpcObject, Metadata } from "shared-ui";
import { Asset } from "shared-ui";

export const AssetDisplay = ({ asset }: { asset: Asset }) => {
  return (
    <Box>
      {asset.image && <img src={asset.image.url}  style={{aspectRatio: '1/1', width: '100%'}}/>}
    </Box>
  );
};
