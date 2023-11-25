import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getInscriptionDataPda } from "../../../pdas/getInscriptionDataPda";
import { useMemo } from "react";
import { useFetchSingleAccount } from "../singleAccountInfo";


export const useInscriptionDataForRoot = ( mint: PublicKey ) => {
  const { connection } = useConnection();
  const inscriptionDataId = useMemo(() => getInscriptionDataPda(mint)[0], [mint]);
  const q = useFetchSingleAccount(inscriptionDataId, connection);
  return q;
};
