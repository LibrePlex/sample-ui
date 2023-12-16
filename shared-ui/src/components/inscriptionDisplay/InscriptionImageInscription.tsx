import { PublicKey } from "@solana/web3.js";
import { useInscriptionDataForRoot } from "../../sdk/query/inscriptions/useInscriptionDataForRoot";
import { useContext, useEffect, useMemo, useState } from "react";
import React from "react";
import { SolscanLink } from "../SolscanLink";
import { ClusterContext } from "../../contexts/NetworkConfigurationProvider";
import { Text, Box, VStack, BoxProps, Button } from "@chakra-ui/react";
import { useUrlPrefixForInscription } from "./useUrlPrefixForInscription";
import { useEncodingForInscription } from "./useEncodingForInscription";
import { InscriptionStats } from "./InscriptionStats";
import { useInscriptionV3ForRoot } from "../../sdk/query/inscriptions/useInscriptionV3ForRoot";
export const InscriptionImage = ({
  root,
  stats,
  ...rest
}: { stats: boolean; root: PublicKey } & BoxProps) => {
  const { cluster } = useContext(ClusterContext);
  const {
    inscription: {
      data: inscription,
      isFetching: isFetchingInscription,
      refetch: refreshInscription,
    },
  } = useInscriptionV3ForRoot(root);

  const urlPrefix = useUrlPrefixForInscription(inscription);

  const encoding = useEncodingForInscription(inscription);

  const {
    data: inscriptionData,
    isFetching: isFetchingInscriptionData,
    refetch: refreshInscriptionData,
  } = useInscriptionDataForRoot(root);

  const [base64ImageInscription, setBase64ImageInscription] = useState<string>();

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    let active = true;
    setBase64ImageInscription(undefined);
    setLoading(true);
    const myWorker = new Worker("worker.js");
    myWorker.onmessage = (e) => {
      console.log({e});
      const _base64 = e.data
        ? Buffer.from(e.data as Buffer).toString("base64")
        : undefined;
      active && setBase64ImageInscription(_base64);
      active && setLoading(false);
    };

    myWorker.postMessage(inscriptionData?.item?.buffer);

    return () => {
      active = false;
    };
  }, [inscriptionData?.item?.buffer]);

  // const base64ImageInscription = useMemo(
  //   () => Buffer.from(inscriptionData?.item?.buffer ?? []).toString("base64"),
  //   [inscriptionData?.item?.buffer]
  // );

  return base64ImageInscription ? (
    <Box {...rest} className="relative" sx={{ ...rest.sx }}>
      {stats && <InscriptionStats root={root} />}
      <img
        style={{
          minHeight: "300px",
          maxHeight: "300px",
          aspectRatio: "1/1",
          borderRadius: 8,
        }}
        src={`data:${urlPrefix};${encoding},${base64ImageInscription}`}
      />
      <Button onClick={() => refreshInscriptionData()}>R</Button>
    </Box>
  ) : (
    <></>
  );
};
