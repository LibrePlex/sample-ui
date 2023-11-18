import { Box, BoxProps, Text } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import React, { useContext, useMemo } from "react";
import { ClusterContext } from "../../contexts/NetworkConfigurationProvider";
import { useInscriptionDataForRoot } from "../../sdk/query/inscriptions/useInscriptionDataForRoot";
import { useInscriptionForRoot } from "../../sdk/query/inscriptions/useInscriptionForRoot";
import { InscriptionStats } from "./InscriptionStats";
import { useEncodingForInscription } from "./useEncodingForInscription";
import { useUrlPrefixForInscription } from "./useUrlPrefixForInscription";
export const InscriptionImage = ({
  root,
  prefixOverride,
  ...rest
}: { root: PublicKey; prefixOverride: string | undefined } & BoxProps) => {
  const { cluster } = useContext(ClusterContext);
  const {
    inscription: { data: inscription },
  } = useInscriptionForRoot(root);

  const urlPrefix = useUrlPrefixForInscription(inscription);

  const encoding = useEncodingForInscription(inscription);

  const { data: inscriptionData } = useInscriptionDataForRoot(root);

  const base64ImageInscription = useMemo(
    () => Buffer.from(inscriptionData?.item?.buffer ?? []).toString("base64"),
    [inscriptionData?.item?.buffer]
  );

  return base64ImageInscription ? (
    <Box {...rest} className="relative" sx={{ ...rest.sx }}>
      <Text>{prefixOverride}asdasd</Text>
      <InscriptionStats root={root} />
      <img
        style={{
          minHeight: "100%",
          maxHeight: "100%",
          aspectRatio: "1/1",
          borderRadius: 8,
        }}
        src={`data:${prefixOverride ?? urlPrefix};${encoding},${base64ImageInscription}`}
      />
    </Box>
  ) : (
    <></>
  );
};
