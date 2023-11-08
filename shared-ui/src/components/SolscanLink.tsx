import React from "react";
import { Box, Spinner, Text, BoxProps } from "@chakra-ui/react";

export const SolscanLink = ({
  mintId,
  txid,
  address,
  cluster,
  ...rest
}: {
  cluster?: string;
  address?: string;
  txid?: string;
  mintId?: string;
} & BoxProps) => (
  <Box
    {...rest}
    sx={{ display: "inline", ...rest.sx }}
    onClick={(e) => {
      e.stopPropagation();
      e.preventDefault();
      window.open(
        `${
          address
            ? `https://solscan.io/address/${address}`
            : mintId
            ? `https://solscan.io/token/${mintId}`
            : `https://solscan.io/tx/${txid}`
        }${cluster ? `?cluster=${cluster}` : ""}`
      );
    }}
  >
    {txid ? (
      <Box m={0.1}>
        {/* <Badge badgeContent={"tx"} color="primary"> */}
        <img width={"24"} src="/solscan.png" />
        {/* </Badge> */}
      </Box>
    ) : (
      <img
        style={{ position: "relative", cursor: "pointer" }}
        width={"24"}
        src="/solscan.png"
      />
    )}
  </Box>
);
