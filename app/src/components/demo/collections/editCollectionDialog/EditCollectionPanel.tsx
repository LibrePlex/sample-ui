import {
  AttachmentIcon,
  CalendarIcon
} from "@chakra-ui/icons";
import { useMemo, useState } from "react";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  Collapse,
  InputGroup,
  InputLeftElement,
  Stack,
  Text
} from "@chakra-ui/react";

import { Input } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";

import { IRoyaltyShare } from "anchor/interfaces/IRoyaltyShare";
import { Collection } from "query/collections";
import { AttributesPanel } from "./AttributesPanel";
import { CreateCollectionTransactionButton } from "./CreateCollectionButton";
import { PermittedSignersPanel } from "./PermittedSignersPanel";
import { RoyaltiesPanel } from "./RoyaltiesPanel";

export const EditCollectionPanel = ({
  onSuccess,
}: {
  onSuccess: () => any;
}) => {
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");

  const [collectionUrl, setCollectionUrl] = useState<string>("");
  const [isNftCollection, setIsNftCollection] = useState<boolean>(false);

  const [permittedSigners, setPermittedSigners] = useState<PublicKey[]>([]);

  const [royaltyBps, setRoyaltyBps] = useState<number>(500);
  const [royaltyShares, setRoyaltyShares] = useState<IRoyaltyShare[]>([]);

  const [validated, setValidated] = useState<boolean>(false);

  const [attributeTypes, setAttributeTypes] = useState<
    Collection["nftCollectionData"]["attributeTypes"]
  >([]);

  const nftCollectionData = useMemo(
    () =>
      isNftCollection && permittedSigners && royaltyShares
        ? {
            royaltyBps,
            royaltyShares,
            permittedSigners,
            attributeTypes,
          }
        : null,
    [
      isNftCollection,
      attributeTypes,
      permittedSigners,
      royaltyShares,
      royaltyBps,
    ]
  );

  return (
    <Stack spacing={4}>
      <Text sx={{ maxWidth: "500px" }}>
        A LibrePlex collection object includes symbol and authority. The
        authority is used as update authority for all items in the collection.
        Every mint in LibrePlex belongs to a collection, including SPL tokens.
      </Text>
      <Text sx={{ maxWidth: "500px" }}>
        Symbol has been moved from individual items to collection level.
      </Text>

      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <CalendarIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Collection name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
      </InputGroup>
      {validated && name.length === 0 && (
        <Text color="red">Name cannot be empty</Text>
      )}
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Text color="gray.300">S</Text>
        </InputLeftElement>
        <Input
          placeholder="Symbol name"
          value={symbol}
          onChange={(e) => setSymbol(e.currentTarget.value)}
        />
      </InputGroup>

      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <AttachmentIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="URL"
          value={collectionUrl}
          onChange={(e) => setCollectionUrl(e.currentTarget.value)}
        />
      </InputGroup>

      <Checkbox
        checked={isNftCollection}
        onChange={(e) => {
          setIsNftCollection(e.currentTarget.checked);
        }}
        colorScheme="red"
        defaultChecked={isNftCollection}
      >
        NFT Collection
      </Checkbox>

      <Collapse in={isNftCollection}>
        <Accordion defaultIndex={0}>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Royalties ({(royaltyBps / 100).toFixed(2)}%)
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text pb={3}>
                Compared to the legacy standard, permitted signers in LibrePlex
                are completely independent of royalty recipients. So, no more
                creators with 0% royalties!
              </Text>
              <RoyaltiesPanel
                royaltyBps={royaltyBps}
                setRoyaltyBps={setRoyaltyBps}
                royaltyShares={royaltyShares}
                setRoyaltyShares={setRoyaltyShares}
              />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Permitted signers ({permittedSigners.length})
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel>
              <PermittedSignersPanel
                permittedSigners={permittedSigners}
                setPermittedSigners={setPermittedSigners}
              />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Attributes ({permittedSigners.length})
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel>
              <AttributesPanel
                attributeTypes={attributeTypes}
                setAttributeTypes={setAttributeTypes}
              />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Collapse>

      {/* <Button onClick={onClick}>Test</Button> */}
      <CreateCollectionTransactionButton
        onSuccess={onSuccess}
        params={{
          name,
          symbol,
          collectionUrl,
          nftCollectionData,
        }}
        formatting={{}}
      />
    </Stack>
  );
};
