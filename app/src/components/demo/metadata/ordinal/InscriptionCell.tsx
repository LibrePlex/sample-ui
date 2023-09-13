
import { IdlAccounts } from "@coral-xyz/anchor";
import { useContext } from "react";
import { IRpcObject, Inscription } from  "@libreplex/shared-ui";
import { useStore } from "zustand";
import {InscriptionStoreContext} from  "@libreplex/shared-ui"
import React from "react";



export const InscriptionCell = ({
  inscription,
}: {
  inscription: IRpcObject<Inscription>;
}) => {

  const store = useContext(InscriptionStoreContext);
 

  const updatedSize = useStore(store, s=>s.updatedInscriptionSizes[inscription?.pubkey.toBase58()])

  return (
    <>
      {inscription
        ? `Ordinal [${updatedSize ?? inscription?.item.size.toLocaleString() ?? "-"} bytes]`
        : ""}
    </>
  );
};
