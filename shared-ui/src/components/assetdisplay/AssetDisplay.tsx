import { Box, Skeleton } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Asset } from "../../sdk/query/metadata/metadata";
import { HttpClient } from "../../utils";
import { AssetDisplayInscription } from "./AssetDisplayInscription";


export interface IOffchainJson {
  // add more fields as needed
  image: string
}

export const AssetDisplay = ({ asset }: { asset: Asset | undefined }) => {
  
  const [offchainJson, setOffchainJson] = useState<IOffchainJson>()

  useEffect(()=>{
    let active = true;
    (async()=>{
    if( asset?.json) {
      const httpClient = new HttpClient('');

      const {data} = await httpClient.get<IOffchainJson>(asset.json.url);

      active && setOffchainJson(data);
    } else {
      active && setOffchainJson(undefined);
    }
  }
    )()
    return () =>{
      active = false;
    }

  },[asset?.json])

  
  return (
    <Box width="100%">
      {asset?.image ? (
        <img
          src={asset.image.url}
          style={{ aspectRatio: "1/1", width: "100%" }}
        />
      ) : 
      asset?.json ? 
        <img 
        src={offchainJson?.image}/> :
      asset?.inscription ? 
        <AssetDisplayInscription inscriptionId={asset?.inscription.accountId}/>
      :
      
      (
        <Skeleton style={{ aspectRatio: "1/1", width: "100%" }}></Skeleton>
      )}
    </Box>
  );
};
