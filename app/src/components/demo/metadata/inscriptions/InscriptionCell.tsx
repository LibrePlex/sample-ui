
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

 
  return (
    <>
      {inscription
        ? `Inscription [${inscription?.item.size.toLocaleString() ?? "-"} bytes]`
        : ""}
    </>
  );
};
