import { Select } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Dispatch, SetStateAction, useState } from "react";
import { Group, IRpcObject, useGroupsByAuthority } from "shared-ui";

export const GroupSelector = ({
    selectedGroup,
    setSelectedGroup

}
    :
    {
        selectedGroup: IRpcObject<Group>,
        setSelectedGroup: Dispatch<SetStateAction<IRpcObject<Group>>>
    }) => {
  const { publicKey } = useWallet();

  const { connection } = useConnection();

  const groups = useGroupsByAuthority(publicKey, connection);

  return (
    <Select
      placeholder="Select group"
      value={selectedGroup?.pubkey.toBase58()}
      onChange={(e) => {
        setSelectedGroup(
          groups.data.find(
            (item) => item.pubkey.toBase58() === e.currentTarget.value
          )
        );
      }}
    >
      {groups.data.map((item, idx) => (
        <option key={idx} value={item.pubkey?.toBase58()}>
          {item.item?.name}
        </option>
      ))}
    </Select>
  );
};
