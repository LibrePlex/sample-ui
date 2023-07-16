import { Connection, PublicKey } from "@solana/web3.js";
import { useContext, useMemo } from "react";
import { InscriptionsProgramContext, LibrePlexProgramContext, LibrePlexShopProgramContext } from "../../../anchor";
import { decodeMetadata } from "./metadata";
import { useMultipleAccountsById } from "./useMultipleAccountsById";
import { decodeInscription } from "../inscriptions";

export const useMultipleInscriptionsById = (
  inscriptionsIds: PublicKey[],
  connection: Connection
) => {
  const program = useContext(InscriptionsProgramContext);

  const decoder = useMemo(() => decodeInscription(program), [program]);
  return useMultipleAccountsById(inscriptionsIds, connection, decoder);
};
