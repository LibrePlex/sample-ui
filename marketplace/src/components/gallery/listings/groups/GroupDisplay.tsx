import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React from "react";
import { useGroupById } from "shared-ui";

export const GroupDisplay = ({ groupKey }: { groupKey: PublicKey }) => {
  const { connection } = useConnection();
  const group = useGroupById(groupKey, connection);

  return <><img src={group?.item?.url}/></>;
};
