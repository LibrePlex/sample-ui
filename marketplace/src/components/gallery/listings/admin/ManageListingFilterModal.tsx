import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { CreateListingGroupTransactionButton } from "./CreateListingGroupTransactionButton";
import {
  CopyPublicKeyButton,
  Group,
  GroupSelector,
  IRpcObject,
  ListingGroup,
  usePublicKeyOrNull,
} from "shared-ui";
import { useListingFiltersByGroup } from "shared-ui/src/sdk/query";
import { DeleteListingFilterTransactionButton } from "./DeleteListingFilterTransactionButton";

export const ManageListingFilterModal = ({
  listingGroup,
}: {
  listingGroup: IRpcObject<ListingGroup>;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const [name, setName] = useState<string>("");

  const { connection } = useConnection();
  const { data: filters } = useListingFiltersByGroup(
    listingGroup.pubkey,
    connection
  );

  const [metadataGroupId, setMetadataGroupId] = useState<string>("");
  
  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Filters ({filters.length})
      </Button>
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create listing filter</ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Text>Manage filters for the group here.</Text>
              <Input placeholder="Metadata group id"></Input>
              <Input
                placeholder="New listing group name"
                value={name}
                onChange={(e) => {
                  setName(e.currentTarget.value);
                }}
              />
              {/* <CreateListingGroupTransactionButton */}
              <Table>
                <Thead>
                  <Tr>
                    <Th>Filter ({filters.length})</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filters.map((item) => (
                    <Tr>
                      <Td>
                        <CopyPublicKeyButton
                          publicKey={item.pubkey.toBase58()}
                        />
                      </Td>
                      <Td>
                        {item.item?.filterType?.group ? (
                          <>
                            <Text>group</Text>
                            <CopyPublicKeyButton
                              publicKey={item.item.filterType.group.pubkey.toBase58()}
                            />{" "}
                          </>
                        ) : item.item?.filterType?.creator ? (
                          "creator"
                        ) : item.item?.filterType?.lister ? (
                          "lister"
                        ) : (
                          "unknown"
                        )}
                      </Td>
                      <Td>
                        {item.deleted ? (
                          <Text>Deleted</Text>
                        ) : (
                          <DeleteListingFilterTransactionButton
                            params={{
                              listingFilter: item.pubkey,
                              listingGroup: listingGroup.pubkey,
                            }}
                            formatting={{}}
                          />
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {/* <GroupSelector
                  selectedGroup={selectedGroup}
                  setSelectedGroup={setSelectedGroup}
                />
  
                {selectedGroup?.pubkey && (
                  <CreateListingGroupTransactionButton
                    formatting={{}}
                    params={{
                      name,
                      filterType: {
                        group: {
                          pubkey: selectedGroup?.pubkey,
                        },
                      },
                    }}
                  />
                )} */}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
