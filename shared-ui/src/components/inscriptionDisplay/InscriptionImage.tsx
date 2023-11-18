import { Box, BoxProps, Text } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import React, { useContext, useEffect, useMemo } from "react";
import { ClusterContext } from "../../contexts/NetworkConfigurationProvider";
import { useInscriptionDataForRoot } from "../../sdk/query/inscriptions/useInscriptionDataForRoot";
import { useInscriptionForRoot } from "../../sdk/query/inscriptions/useInscriptionForRoot";
import { InscriptionStats } from "./InscriptionStats";
import { useEncodingForInscription } from "./useEncodingForInscription";
import { useUrlPrefixForInscription } from "./useUrlPrefixForInscription";
export const InscriptionImage = ({
  root,
  ...rest
}: { root: PublicKey;  } & BoxProps) => {
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

  const asciiImageInscription = useMemo(
    () => Buffer.from(inscriptionData?.item?.buffer ?? []).toString("ascii"),
    [inscriptionData?.item?.buffer]
  );

  useEffect(()=>{
    console.log({base64ImageInscription, asciiImageInscription})
  },[base64ImageInscription, asciiImageInscription])

  const prefixOverride = useMemo(()=>asciiImageInscription?.startsWith("<svg") || asciiImageInscription.startsWith("<SVG") ? "image/svg+xml": undefined,[asciiImageInscription])
    

  return base64ImageInscription ? (
    <Box {...rest} className="relative" sx={{ ...rest.sx, display :"flex", flexDirection: 'column', alignItems :"center" }}>
      <InscriptionStats root={root} />
      <img
        style={{
          minWidth: "100%",
          maxWidth: "100%",
          borderRadius: 8,
        }}
        src={`data:${prefixOverride ?? urlPrefix};${encoding},${base64ImageInscription}`}
      />
      
      <Text mt={3}>{prefixOverride ?? urlPrefix}</Text>
    </Box>
  ) : (
    <></>
  );
};
