import { Connection, PublicKey } from "@solana/web3.js";
import { useContext, useMemo } from "react";

import { decodeInscription } from "../inscriptions/inscriptions";
import { useMultipleAccountsById } from "./useMultipleAccountsById";
import { InscriptionsProgramContext } from "../inscriptions/InscriptionsProgramContext";

export const useMultipleInscriptionsById = (
  inscriptionsIds: PublicKey[],
  connection: Connection
) => {
  const program = useContext(InscriptionsProgramContext);

  const decoder = useMemo(() => decodeInscription(program), [program]);
  return useMultipleAccountsById(inscriptionsIds, connection, decoder);
};
