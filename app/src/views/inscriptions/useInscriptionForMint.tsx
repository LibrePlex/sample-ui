import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useContext, useMemo } from "react";
import {
  PROGRAM_ID_INSCRIPTIONS,
  decodeInscription,
  getInscriptionPda,
  useFetchSingleAccount,
} from "@libreplex/shared-ui";
import { InscriptionsProgramContext } from "shared-ui/src/sdk/query/inscriptions/InscriptionsProgramContext";

export const useInscriptionForMint = (mint: PublicKey) => {
  const { connection } = useConnection();
  const inscriptionId = useMemo(() => getInscriptionPda(mint)[0], [mint]);
  const { data } = useFetchSingleAccount(inscriptionId, connection);
  const program = useContext(InscriptionsProgramContext);

  const obj = useMemo(
    () =>
      data?.item
        ? decodeInscription(program)(data.item.buffer, data.pubkey)
        : undefined,
    [data.item, data.pubkey, program]
  );
  return obj;
};
