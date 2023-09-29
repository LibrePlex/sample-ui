import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Collection } from "../../sdk";


import React, { useContext } from "react";
import { IRpcObject } from "..";
import {
  useFunder,
  useRenderedResult,
} from "../assetdisplay/useRenderedResult";
import { PublicKey } from "@solana/web3.js";
import { Asset, AssetType } from "../../sdk/query/metadata/metadata";
import { useConnection } from "@solana/wallet-adapter-react";
import { AttributeDisplayRowChainRenderer } from "./AttributeDisplayRowChainRenderer";
import { MetadataProgramContext } from "../../anchor";

export const AttributesDisplayChainRenderer = ({
  mint,
  asset,
 }: {
  asset: Asset["chainRenderer"];
  mint: PublicKey;
}) => {
  const funder = useFunder();

  const { connection } = useConnection();
  const { program } = useContext(MetadataProgramContext);
  
  const { data: renderedResult } = useRenderedResult(
    mint,
    asset.programId,
    program.programId,
    connection,
    funder
  );

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Attribute</Th>
          <Th>Value</Th>
        </Tr>
      </Thead>
      <Tbody>
        {[...(renderedResult?.attributes ?? [])].map((item, idx) => (
          <AttributeDisplayRowChainRenderer
            key={idx}
            name={item.trait_type}
            value={item.value}
          />
        ))}
      </Tbody>
    </Table>
  );
};
