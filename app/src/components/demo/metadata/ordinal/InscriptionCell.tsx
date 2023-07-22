
import { IdlAccounts } from "@coral-xyz/anchor";
import { useContext } from "react";
import { IRpcObject, Inscription, InscriptionStoreContext } from "shared-ui";
import { useStore } from "zustand";



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
