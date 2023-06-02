import { Td, Tr, Text, Center, Checkbox } from "@chakra-ui/react";
import { CopyPublicKeyButton } from "components/buttons/CopyPublicKeyButton";
import { IRpcObject } from "components/executor/IRpcObject";
import { CollectionPermissions } from "query/permissions";

import { Collection } from "query/collections";
import useDeletedKeysStore from "stores/useDeletedKeyStore";
import { DeleteCollectionTransactionButton } from "./DeleteCollectionButton";
import { PublicKey } from "@solana/web3.js";
import { AddMetadataButton } from "./metadatadialog/AddMetadataButton";
import { RoyaltiesDialog } from "./metadatadialog/RoyaltiesDialog";
import { PermittedSignersDialog } from "./metadatadialog/PermittedSignersDialog";
import { AttributesDialog } from "./AttributesDialog";

export const CollectionRow = ({
  item,
  permissions,
  selectedCollections,
  toggleSelectedCollection,
}: {
  permissions: IRpcObject<CollectionPermissions> | undefined;
  item: IRpcObject<Collection>;
  selectedCollections: Set<PublicKey>;
  toggleSelectedCollection: (pubkey: PublicKey, b: boolean) => any;
}) => {
  const deletedKeys = useDeletedKeysStore((state) => state.deletedKeys);
  return (
    <Tr
      sx={{
        background: deletedKeys.has(item.pubkey) ? "#fee" : "none",
      }}
    >
      <Td>
        <Center>
          <Checkbox
            isChecked={selectedCollections.has(item.pubkey)}
            onChange={(e) => {
              toggleSelectedCollection(item.pubkey, e.currentTarget.checked);
            }}
          />
        </Center>
      </Td>
      <Td>
        <Center>
          {item &&
            permissions &&
            (deletedKeys.has(item.pubkey) ? (
              <Text>Deleted</Text>
            ) : (
              <AddMetadataButton size="sm" collection={item} />
            ))}
        </Center>
      </Td>
      <Td>
        <CopyPublicKeyButton publicKey={item.pubkey.toBase58()} />
      </Td>
      <Td>{item.item.name}</Td>
      <Td isNumeric>
        <Center>{item.item.itemCount.toString()}</Center>
      </Td>
      <Td isNumeric>
        <Center>{item.item.symbol}</Center>
      </Td>
      <Td isNumeric>
        <Center>{item.item.nftCollectionData?.royaltyBps}</Center>
      </Td>
      <Td isNumeric>
        <Center>
          {item.item.nftCollectionData?.royaltyShares && (
            <RoyaltiesDialog
              royalties={item.item.nftCollectionData?.royaltyShares}
            />
          )}
        </Center>
      </Td>

      <Td isNumeric>
        <Center>
          {item.item.nftCollectionData?.royaltyShares && (
            <PermittedSignersDialog
              permittedSigners={item.item.nftCollectionData?.permittedSigners}
            />
          )}
        </Center>
      </Td>
      <Td isNumeric>
        <AttributesDialog
          attributeTypes={item.item.nftCollectionData?.attributeTypes ?? []}
        />
      </Td>
    </Tr>
  );
};
