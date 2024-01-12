import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { useInscriptionDataForRoot, useInscriptionV3ForRoot } from "../../sdk";
import {
  getBase64FromDatabytes
} from "../../sdk/query/inscriptions/inscriptions";

export const AssetDisplayInscription = ({
  rootId,
  dataType,
}: {
  rootId: PublicKey;
  dataType: string;
}) => {
  const { connection } = useConnection();
  const inscription = useInscriptionV3ForRoot(rootId);
  const { data: inscriptionData } = useInscriptionDataForRoot(rootId);

  const [currentBase64Image, setCurrentBase64Image] = useState<string>();
  useEffect(() => {
    if (inscription) {
      const url = getBase64FromDatabytes(
        inscriptionData.item.data,
        dataType ?? ""
      );
      setCurrentBase64Image(url);
    }
  }, [inscription, inscriptionData.item.data, dataType]);

  return (
    <img
      src={currentBase64Image}
      style={{ aspectRatio: "1/1", width: "100%" }}
    />
  );
};
