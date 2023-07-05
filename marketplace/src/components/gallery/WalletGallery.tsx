import { Box, useConst } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import React from "react";
import { useConnection } from "@solana/wallet-adapter-react";

import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

import { useTokenAccountsByOwner } from "shared-ui";
import { MintCard } from "./mintcard/MintCard";
export const WalletGallery = ({ publicKey }: { publicKey: PublicKey }) => {
  const { connection } = useConnection();
  const { data } = useTokenAccountsByOwner(
    publicKey,
    connection,
    TOKEN_2022_PROGRAM_ID,
    "ownedmints"
  );

  return (
    <Box p={20} display="flex" flexDirection="column">
      {data.filter(item=>item.item).map((item, idx) => (
        <MintCard key={idx} tokenAccount={{pubkey: item.pubkey, item: item.item!}}/>
      ))}
    </Box>
  );
};
