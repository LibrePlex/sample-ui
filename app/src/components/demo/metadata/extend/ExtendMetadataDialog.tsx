import { InfoIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Collapse,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Select,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { IRoyaltyShare } from "anchor/interfaces/IRoyaltyShare";
import { RoyaltiesPanel } from "components/demo/collections/editCollectionDialog/RoyaltiesPanel";
import { AttributeSelectorPanel } from "components/demo/collections/metadatadialog/AttributeSelectorPanel";
import { ExtendMetadataButton } from "components/demo/collections/metadatadialog/ExtendMetadataButton";
import { usePermittedCollections as usePermittedGroups } from "components/demo/collections/usePermittedCollections";
import { IRpcObject } from "components/executor/IRpcObject";
import { Group } from "query/group";
import { Metadata } from "query/metadata";
import { useEffect, useMemo, useState } from "react";

enum View {
  Standalone,
  MintToCollection,
}

enum Status {
  NotStarted,
  Processing,
  Success,
}

export const ExtendMetadataDialog = ({
  open,
  onClose,
  metadata,
}: {
  metadata: IRpcObject<Metadata>;
  open: boolean;
  onClose: () => any;
}) => {
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const { publicKey } = useWallet();

  const { connection } = useConnection();

  const { groups } = usePermittedGroups();

  const [selectedGroup, setSelectedGroup] = useState<IRpcObject<Group>>();

  const [status, setStatus] = useState<Status>(Status.NotStarted);

  const numberOfAttributes = useMemo(
    () => selectedGroup?.item?.attributeTypes?.length ?? 0,
    [selectedGroup]
  );

  const [attributes, setAttributes] = useState<number[]>([
    ...Array(numberOfAttributes),
  ]);

  useEffect(()=>{
    setAttributes([...Array(numberOfAttributes)])
  },[numberOfAttributes])

  const [royaltyBps, setRoyaltyBps] = useState<number>(500);
  const [royaltyShares, setRoyaltyShares] = useState<IRoyaltyShare[]>([]);

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Extend Metadata</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Select placeholder="Select group" onChange={(e)=>{
                setSelectedGroup(groups.find(item=>item.pubkey.toBase58() === e.currentTarget.value))
              }}>
                {groups.map((item, idx) => (
                  <option key={idx} value={item.pubkey?.toBase58()} selected={selectedGroup === item}>
                    {item.item?.name}
                  </option>
                ))}
                {/* <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option> */}
              </Select>
              <Button
                onClick={() => {
                  setShowInfo((old) => !old);
                }}
              >
                <InfoIcon />
              </Button>
              <Collapse in={showInfo}>
                <Text sx={{ maxWidth: "500px" }}>
                  An LibrePlex standard, you can extend base metadata with
                  attributes and royalties. All extended metadata must belong to
                  a collection.
                </Text>
              </Collapse>
            </Box>
            <AttributeSelectorPanel
              attributes={attributes}
              setAttributes={setAttributes}
              collection={selectedGroup}
            />
            {/* <RoyaltiesPanel
              royaltyBps={royaltyBps}
              setRoyaltyBps={setRoyaltyBps}
              royaltyShares={royaltyShares}
              setRoyaltyShares={setRoyaltyShares}
            /> */}
            {selectedGroup && (
              <ExtendMetadataButton
                params={{
                  attributes,
                  mint: metadata.item.mint,
                  group: selectedGroup.pubkey,
                  royalties: undefined,
                //   royalties:
                //     royaltyShares.length > 0
                //       ? {
                //           shares: royaltyShares,
                //           bps: royaltyBps,
                //         }
                //       : null,
                }}
                formatting={undefined}
              />
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
