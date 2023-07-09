import { Box, Skeleton } from "@chakra-ui/react";
import React from "react";
import { Asset } from "shared-ui";

export const AssetDisplay = ({ asset }: { asset: Asset | undefined }) => {
  return (
    <Box width="100%">
      {asset?.image ? (
        <img
          src={asset.image.url}
          style={{ aspectRatio: "1/1", width: "100%" }}
        />
      ) : (
        <Skeleton style={{ aspectRatio: "1/1", width: "100%" }}></Skeleton>
      )}
    </Box>
  );
};
