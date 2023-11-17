import { PublicKey } from "@solana/web3.js";
import { useInscriptionDataForRoot } from "../../sdk/query/inscriptions/useInscriptionDataForRoot";
import { useInscriptionForRoot } from "../../sdk/query/inscriptions/useInscriptionForRoot";
import { useContext, useMemo } from "react";
import React from "react";
import { SolscanLink } from "../../components/SolscanLink";
import { ClusterContext } from "../../contexts/NetworkConfigurationProvider";
import { Text, Box, VStack, BoxProps } from "@chakra-ui/react";
import { useUrlPrefixForInscription } from "./useUrlPrefixForInscription";
import { useEncodingForInscription } from "./useEncodingForInscription";
import { InscriptionStats } from "./InscriptionStats";
export const InscriptionImage = ({
  root,
  stats,
  ...rest
}: { stats: boolean,root: PublicKey } & BoxProps) => {
  const { cluster } = useContext(ClusterContext);
  const {
    inscription: {
      data: inscription,
      isFetching: isFetchingInscription,
      refetch: refreshInscription,
    },
  } = useInscriptionForRoot(root);

  const urlPrefix = useUrlPrefixForInscription(inscription);

  const encoding = useEncodingForInscription(inscription);

  const {
    data: inscriptionData,
    isFetching: isFetchingInscriptionData,
    refetch: refreshInscriptionData,
  } = useInscriptionDataForRoot(root);

  const base64ImageInscription = useMemo(
    () => Buffer.from(inscriptionData?.item?.buffer ?? []).toString("base64"),
    [inscriptionData?.item?.buffer]
  );

  return base64ImageInscription ? (
    <Box {...rest} className="relative" sx={{ ...rest.sx }}>
      <SolscanLink
        address={inscriptionData.pubkey.toBase58()}
        cluster={cluster}
        className="absolute top-1 right-1"
      />
      {stats &&<InscriptionStats root={root}/>}
      <img
        style={{
          minHeight: "100%",
          maxHeight: "100%",
          aspectRatio: "1/1",
          borderRadius: 8,
        }}
        src={`data:${urlPrefix};${encoding},${base64ImageInscription}`}
      />
   
    </Box>
  ) : (
    <></>
  );
};
