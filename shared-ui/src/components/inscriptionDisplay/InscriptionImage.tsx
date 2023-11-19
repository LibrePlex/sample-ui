import { Box, BoxProps, Text } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import React, { useContext } from "react";
import { ClusterContext } from "../../contexts/NetworkConfigurationProvider";
import { useInscriptionForRoot } from "../../sdk/query/inscriptions/useInscriptionForRoot";
import { useInscriptionV3ForRoot } from "../../sdk/query/inscriptions/useInscriptionV2ForRoot";
import { useMediaPrefix } from "./useMediaPrefix";
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

  const {
    base64ImageInscription,
    asciiImageInscription,
    isText,
    encoding,
    mediaType,
  } = useMediaPrefix(root);

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
    </Box>
  ) : (
    <></>
  );
};
