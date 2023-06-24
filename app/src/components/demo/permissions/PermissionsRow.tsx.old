import { CheckCircleIcon } from "@chakra-ui/icons";
import { Center, Checkbox, Td, Tr } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { CopyPublicKeyButton } from "components/buttons/CopyPublicKeyButton";
import { IRpcObject } from "components/executor/IRpcObject";

import { Permissions } from "query/permissions";

export const PermissionsRow = ({
  item,
  selectedPermissions,
  toggleSelectedPermission,
}: {
  selectedPermissions: Set<PublicKey>;
  toggleSelectedPermission: (pubkey: PublicKey, b: boolean) => any;
  //   setSelectedPermissions: Dispatch<SetStateAction<Set<PublicKey>>>;
  item: IRpcObject<Permissions>;
}) => {
  return (
    <Tr>
      <Td>
        <Center>
          <Checkbox
            isChecked={selectedPermissions.has(item.pubkey)}
            onChange={(e) => {
              toggleSelectedPermission(item.pubkey, e.currentTarget.checked);
            }}
          />
        </Center>
      </Td>
      <Td>
        <CopyPublicKeyButton publicKey={item.pubkey.toBase58()} />
      </Td>
      {/* <Td align={"center"}>
        <Center>{item.item.isAdmin ? <CheckCircleIcon /> : <></>}</Center>
      </Td>
      <Td align={"center"}>
        <Center>
          {item.item.canCreateMetadata ? <CheckCircleIcon /> : <></>}
        </Center>
      </Td>
      <Td align={"center"}>
        <Center>
          {item.item.canEditMetadata ? <CheckCircleIcon /> : <></>}
        </Center>
      </Td>
      <Td align={"center"}>
        <Center>
          {item.item.canDeleteMetadata ? <CheckCircleIcon /> : <></>}
        </Center>
      </Td>

      <Td align={"center"}>
        <Center>
          {item.item.collection && (
            <CopyPublicKeyButton publicKey={item.item.collection.toBase58()} />
          )}
        </Center>
      </Td>

      <Td align={"center"}>
        <Center>
          {item.item.canEditCollection ? <CheckCircleIcon /> : <></>}
        </Center>
      </Td>

      <Td align={"center"}>
        <Center>
          {item.item.canDeleteCollection ? <CheckCircleIcon /> : <></>}
        </Center>
      </Td>
      <Td>
        <DeleteCollectionPermissionsTransactionButton
          params={[
            {
              collection: item.item.collection,
              collectionPermissions: item.pubkey,
            },
          ]}
          formatting={{}}
        />{" "}
      </Td> */}
    </Tr>
  );
};
