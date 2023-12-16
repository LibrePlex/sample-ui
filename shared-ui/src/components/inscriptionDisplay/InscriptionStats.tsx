import { PublicKey } from "@solana/web3.js";
import React from "react";
import { useInscriptionV3ForRoot } from "../../sdk";
import { Badge } from "@chakra-ui/react";
import { useFormattedNumber } from "../../utils/useFormattedNumber";
import { useRentForDataLength } from "../../components/useRentForDataLength";
export const InscriptionStats = ({ root }: { root: PublicKey }) => {
  const {
    inscription: { data: inscription, refetch, isFetching },
  } = useInscriptionV3ForRoot(root);

  const formattedSize = useFormattedNumber(inscription?.item?.size ?? 0, 0);

  const rent = useRentForDataLength(inscription.item.size);

  return inscription?.item ? (
    <div className="flex flex-col items-end absolute top-2 right-2">
      <Badge
        sx={{
          border: "1px solid #aaa",
          background: "#333",
        }}
      >
        #{Number(inscription.item.order).toLocaleString()}
      </Badge>
      <Badge
        sx={{
          border: "1px solid #aaa",
          background: "#333",
        }}
      >
        Size: {formattedSize}B
      </Badge>
      <Badge
        sx={{
          border: "1px solid #aaa",
          background: "#333",
        }}
      >
        Rent: {rent} SOL
      </Badge>
    </div>
  ) : (
    <></>
  );
};
