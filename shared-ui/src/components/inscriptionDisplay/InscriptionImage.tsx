import { Box, BoxProps, Text } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import React, { useContext, useEffect, useMemo } from "react";
import { ClusterContext } from "../../contexts/NetworkConfigurationProvider";
import { useInscriptionDataForRoot } from "../../sdk/query/inscriptions/useInscriptionDataForRoot";
import { useInscriptionForRoot } from "../../sdk/query/inscriptions/useInscriptionForRoot";
import { useInscriptionV3ForRoot } from "../../sdk/query/inscriptions/useInscriptionV2ForRoot";
import { InscriptionStats } from "./InscriptionStats";
import { useEncodingForInscription } from "./useEncodingForInscription";
import { useUrlPrefixForInscription } from "./useUrlPrefixForInscription";
export const InscriptionImage = ({
  root,
  ...rest
}: { root: PublicKey } & BoxProps) => {
  const { cluster } = useContext(ClusterContext);
  const {
    inscription: { data: inscription },
  } = useInscriptionForRoot(root);

  const {
    inscription: { data: inscriptionV3 },
  } = useInscriptionV3ForRoot(root);

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

  // useEffect(()=>{
  //   console.log({base64ImageInscription, asciiImageInscription})
  // },[base64ImageInscription, asciiImageInscription])

  const prefixOverride = useMemo(
    () =>
      asciiImageInscription?.startsWith("<svg") ||
      asciiImageInscription.startsWith("<SVG")
        ? "image/svg+xml"
        : undefined,
    [asciiImageInscription]
  );

  const mediaType = useMemo(
    () =>
      (inscriptionV3?.item?.contentType !== ""
        ? inscriptionV3?.item?.contentType
        : undefined) ??
      prefixOverride ??
      urlPrefix ??
      "image/*",
    [inscriptionV3.item, prefixOverride, urlPrefix]
  );

  const isText = useMemo(
    () => mediaType.startsWith("text/") || mediaType === "application/text",
    [mediaType]
  );

  return base64ImageInscription ? (
    <Box
      {...rest}
      className="relative"
      sx={{
        ...rest.sx,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
      }}
    >
      {/* <InscriptionStats root={root} /> */}

      {isText ? (
        <Text>{asciiImageInscription}</Text>
      ) : (
        <img
          style={{
            height: "100%",
            borderRadius: 8,
          }}
          src={`data:${mediaType};${
            encoding ?? "base64"
          },${base64ImageInscription}`}
        />
      )}
      <Text mt={3}>{(prefixOverride ?? mediaType)?.slice(0, 15)}</Text>
    </Box>
  ) : (
    <></>
  );
};
