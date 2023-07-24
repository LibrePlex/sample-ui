import { Inscription, getBase64FromDatabytes, useInscriptionById } from "../../sdk/query/inscriptions";
import { IRpcObject } from "..";
import { useEffect, useMemo, useState } from "react";
import React from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";


export const AssetDisplayInscription = ({inscriptionId, dataType}:{inscriptionId: PublicKey, dataType: string}) => {
  const { connection } = useConnection();
  const inscription = useInscriptionById(inscriptionId, connection);

  const [currentBase64Image, setCurrentBase64Image] = useState<string>();
  useEffect(() => {
    if (inscription) {
      const url = getBase64FromDatabytes(
        Buffer.from(inscription.item.dataBytes),
        dataType ??''
      );
      setCurrentBase64Image(url);
    }
  }, [inscription, inscription?.item.dataBytes, dataType]);

  return (
    <img
      src={currentBase64Image}
      style={{ aspectRatio: "1/1", width: "100%" }}
    />
  );
};
