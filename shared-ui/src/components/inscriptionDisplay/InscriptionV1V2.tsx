import { PublicKey } from "@solana/web3.js";
import { useInscriptionForRoot } from "../../sdk";
import { useInscriptionV2ForRoot } from "../../sdk/query";
import React from "react";
import { SimpleGrid, Text } from "@chakra-ui/react";
import { mediaTypeToString } from "./useMediaType";

export const InscriptionV1V2 = ({ mint }: { mint: PublicKey }) => {
  const { inscription } = useInscriptionForRoot(mint);
  const { inscription: inscriptionV2 } = useInscriptionV2ForRoot(mint);

  return (
    <SimpleGrid columns={3}>
      <Text>Aauth</Text>
      <Text>{inscription.data?.item.authority.toBase58()}</Text>
      <Text>{inscriptionV2.data?.item?.authority.toBase58()}</Text>

      <Text>encoding</Text>
      <Text>{inscription.data?.item.encodingType.base64 ? "y" : "n"}</Text>
      <Text>{(inscriptionV2.data?.item as any)?.encoding as string}</Text>

      <Text>inscription data</Text>
      <Text>{inscription.data?.item.inscriptionData.toBase58()}</Text>
      <Text>{inscriptionV2.data?.item?.inscriptionData.toBase58()}</Text>

      <Text>media type</Text>
      <Text>{JSON.stringify(inscription.data?.item.mediaType)}</Text>
      <Text>{(inscriptionV2.data?.item as any)?.contentType}</Text>

      <Text>{inscription.data?.item.order.toString()}</Text>
      <Text>{inscriptionV2.data?.item?.order.toString()}</Text>

      <Text>{inscription.data?.item.root.toString()}</Text>
      <Text>{inscriptionV2.data?.item?.root.toString()}</Text>

      <Text>{inscription.data?.item.size}</Text>
      <Text>{inscriptionV2.data?.item?.size}</Text>

      {/* <Text>{inscription.data?.item.validationHash}</Text> */}
      {/* <Text>{inscriptionV2.data?.item.validationHash}</Text> */}
    </SimpleGrid>
  );
};
