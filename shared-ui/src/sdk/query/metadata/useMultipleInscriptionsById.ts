import { Connection, PublicKey } from "@solana/web3.js";
import { useContext, useMemo } from "react";
import {
  InscriptionsProgramContext
} from "../../../anchor";
import { decodeInscription } from "../inscriptions";
import { useMultipleAccountsById } from "./useMultipleAccountsById";

export const useMultipleInscriptionsById = (
  inscriptionsIds: PublicKey[],
  connection: Connection
) => {
  const program = useContext(InscriptionsProgramContext);

  const decoder = useMemo(() => decodeInscription(program), [program]);
  return useMultipleAccountsById(inscriptionsIds, connection, decoder);
};
