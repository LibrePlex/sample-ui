import { useContext, useMemo } from "react";
import {
  decodeInscriptionSummary,
  getInscriptionSummaryPda,
  InscriptionsProgramContext,
  useFetchSingleAccount,
} from "@libreplex/shared-ui";
import { useConnection } from "@solana/wallet-adapter-react";

export const useInscriptionSummary = (internal?: number) => {
  const inscriptionSummaryId = useMemo(() => getInscriptionSummaryPda()[0], []);

  const program = useContext(InscriptionsProgramContext);

  const { connection } = useConnection();
  const { data, refetch } = useFetchSingleAccount(
    inscriptionSummaryId,
    connection,
    internal
  );

  return {
    data: useMemo(() => {
      return data?.item
        ? decodeInscriptionSummary(program)(data.item.buffer, data.pubkey)
        : undefined;
    }, [program, data]),
    refetch,
  };

  // useEffect(() => {
  //   console.log({ inscriptionSummary });
  // }, [inscriptionSummary]);
};
