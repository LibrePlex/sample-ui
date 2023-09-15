import { IRpcObject } from './../../../components/executor/IRpcObject';
import { Connection, PublicKey } from "@solana/web3.js";
import { useContext, useMemo } from "react";

import { Inscription, decodeInscription } from "../inscriptions/inscriptions";
import { useMultipleAccountsById } from "./useMultipleAccountsById";
import { InscriptionsProgramContext } from "../inscriptions/InscriptionsProgramContext";

export const useMultipleInscriptionsById = (
  inscriptionsIds: PublicKey[],
  connection: Connection
) => {
  const program = useContext(InscriptionsProgramContext);

  const decoder = useMemo(() => decodeInscription(program), [program]);
  const results = useMultipleAccountsById(inscriptionsIds, connection);

  const decoded = useMemo(()=>{
    //  console.log({ result, orderedIds });

        const _groups: IRpcObject<Inscription>[] = [];
        for (const res of results.data ) {
          if (res.data) {
            try {
              const parsedObj = decoder(res.data, res.accountId);
              if (parsedObj.item) {
                _groups.push({ ...parsedObj, item: parsedObj.item! });
              }
            } catch (e) {
              console.log({ e });
            }
          }
        }
        return _groups;
  },[decoder, results])
  return {...results, data: decoded};

};
