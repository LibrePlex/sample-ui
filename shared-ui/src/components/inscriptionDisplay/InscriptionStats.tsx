import { PublicKey } from "@solana/web3.js"
import React from "react"
import { useInscriptionForRoot } from "../../sdk";
import {Badge} from "@chakra-ui/react"
import { useFormattedNumber } from "../../utils/useFormattedNumber";
export const InscriptionStats = ({root}:{root: PublicKey}) => {
    const {
        inscription: { data: inscription, refetch, isFetching },
      } = useInscriptionForRoot(root);


      const formattedSize = useFormattedNumber(inscription?.item?.size ?? 0, 0);


    return inscription?.item ? 
    <div
      className="flex flex-col items-end absolute top-2 right-2 z-10"
    >
      <Badge
        sx={{
          border: "1px solid #aaa",
          background: "#333",
        }}
      >
        #{inscription.item.order.toNumber().toLocaleString()}
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
         Rent: {(Math.round((0.00089088 + 0.00000696 * inscription?.item?.size)*100)/100).toFixed(2)} SOL
      </Badge>
    </div> : <></>
}
  