import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import {
  getBase64FromDatabytes,
  useInscriptionById,
} from "../../sdk/query/inscriptions/inscriptions";
import { useInscriptionDataForMint, useInscriptionForMint } from "../../sdk";

export const AssetDisplayInscription = ({
  rootId,
  dataType,
}: {
  rootId: PublicKey;
  dataType: string;
}) => {
  const { connection } = useConnection();
  const inscription = useInscriptionForMint(rootId);
  const {data: inscriptionData} = useInscriptionDataForMint(rootId);

  const [currentBase64Image, setCurrentBase64Image] = useState<string>();
  useEffect(() => {
    if (inscription) {
      const url = getBase64FromDatabytes(
        inscriptionData.item.buffer,
        dataType ?? ""
      );
      setCurrentBase64Image(url);
    }
  }, [inscription, inscriptionData.item.buffer, dataType]);

  return (
    <img
      src={currentBase64Image}
      style={{ aspectRatio: "1/1", width: "100%" }}
    />
  );
};
