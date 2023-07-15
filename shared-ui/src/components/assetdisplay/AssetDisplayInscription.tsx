import { Inscription, useInscriptionById } from "../../sdk/query/inscriptions";
import { IRpcObject } from "..";
import { useEffect, useMemo, useState } from "react";
import React from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";

export const AssetDisplayInscription = ({inscriptionId}:{inscriptionId: PublicKey}) => {
  const { connection } = useConnection();
  const inscription = useInscriptionById(inscriptionId, connection);

  const [currentBase64Image, setCurrentBase64Image] = useState<string>();
  useEffect(() => {
    if (inscription) {
      const base = Buffer.from(inscription.item.dataBytes).toString("base64");
      console.log({base})
      const dataType = base.split("/")[0];
      const dataSubType = base.split("/")[1];
      const data = base.split("/").slice(2).join("/");
      setCurrentBase64Image(`data:${dataType}/${dataSubType};base64,${data}==`);
    }
  }, [inscription, inscription?.item.dataBytes]);

  return (
    <img
      src={currentBase64Image}
      style={{ aspectRatio: "1/1", width: "100%" }}
    />
  );
};
