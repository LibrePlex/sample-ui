import { PublicKey } from "@solana/web3.js";
import { useInscriptionDataForRoot } from "../../sdk/query/inscriptions/useInscriptionDataForRoot";
import { useInscriptionForRoot } from "../../sdk/query/inscriptions/useInscriptionForRoot";
import { useContext, useMemo } from "react";
import React from "react";
import { SolscanLink } from "../../components/SolscanLink";
import { ClusterContext } from "../../contexts/NetworkConfigurationProvider";
import { Text, Box, VStack } from "@chakra-ui/react";
import { useUrlPrefixForInscription } from "./useUrlPrefixForInscription";
import { useEncodingForInscription } from "./useEncodingForInscription";
export const InscriptionImage = ({ root }: { root: PublicKey }) => {
  const { cluster } = useContext(ClusterContext);
  const {
    data: inscription,
    isFetching: isFetchingInscription,
    refetch: refreshInscription,
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
    <Box sx={{ position: "relative" }}>
      <SolscanLink
        address={inscriptionData.pubkey.toBase58()}
        cluster={cluster}
        sx={{
          position: "absolute",
          top: "8px",
          right: "8px",
        }}
      />
      <img
        style={{
          minWidth: "240px",
          maxWidth: "240px",
          aspectRatio: "1/1",
          borderRadius: 8,
        }}
        src={`data:${urlPrefix};${encoding},${base64ImageInscription}`}
      />
      <VStack sx={{ position: "absolute", bottom: "8px", left: "50%", transform: 'translate(-50%)' }}>
        <Text>{encoding}</Text>
        <Text>{urlPrefix}</Text>
      </VStack>
    </Box>
  ) : (
    <></>
  );
};
