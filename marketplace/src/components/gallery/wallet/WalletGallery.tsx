import {
  Box,
  VStack
} from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useMemo } from "react";

import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

import { useTokenAccountsByOwner } from "shared-ui";
import { MintCard } from "../../mintcard/MintCard";
import { WalletAction } from "./walletcard/WalletAction";
import { CreateListingModal } from "./walletcard/CreateListingModal";
export const WalletGallery = ({ publicKey }: { publicKey: PublicKey }) => {
  const { connection } = useConnection();
  const { data } = useTokenAccountsByOwner(
    publicKey,
    connection,
    TOKEN_2022_PROGRAM_ID
  );

  const sortedData = useMemo(
    () =>
      data.sort((a, b) =>
        a.pubkey.toBase58().localeCompare(b.pubkey.toBase58())
      ),
    [data]
  );

  return (
      <Box p={20} display="flex" flexDirection="row" flexWrap={'wrap'} gap={2}>
        {sortedData
          .filter((item) => item.item)
          .map((item, idx) => (
            <MintCard key={idx} mint={item.item?.mint!}>
              {item.item ? <CreateListingModal item={{...item, item: item.item!}} /> : <></>}
            </MintCard>
          ))}
      </Box>
  );
};
