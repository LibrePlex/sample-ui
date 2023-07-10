import { CalendarIcon } from "@chakra-ui/icons";
import { Textarea } from "@chakra-ui/react";
import { useContext, useMemo, useState } from "react";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  InputGroup,
  InputLeftElement,
  Stack,
  Text
} from "@chakra-ui/react";

import { Input } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { Group, LibrePlexProgramContext, RoyaltyShare } from "shared-ui";
import { AttributesPanel } from "./AttributesPanel";
import { CreateCollectionTransactionButton } from "./CreateGroupButton";
import { PermittedSignersPanel } from "./PermittedSignersPanel";
import { RoyaltiesPanel } from "./RoyaltiesPanel";

export const EditGroupPanel = ({ onSuccess }: { onSuccess: () => any }) => {
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");

  const [collectionUrl, setCollectionUrl] = useState<string>("");
  
  const [permittedSigners, setPermittedSigners] = useState<PublicKey[]>([]);

  const [royaltyBps, setRoyaltyBps] = useState<number>(500);
  const [royaltyShares, setRoyaltyShares] = useState<RoyaltyShare[]>([]);

  const [validated, setValidated] = useState<boolean>(false);

  const [attributeTypes, setAttributeTypes] = useState<Group["attributeTypes"]>(
    []
  );

  const [description, setDescription] = useState<string>("");

  const royalties = useMemo(
    () =>
      royaltyShares
        ? {
            bps: royaltyBps,
            shares: royaltyShares,
          }
        : null,
    [royaltyShares, royaltyBps]
  );
  const {program} = useContext(LibrePlexProgramContext)

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
          placeholder="Group name"
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

      <Textarea
        value={description}
        onChange={(e) => {
          setDescription(e.currentTarget.value);
        }}
        placeholder="Description"
        size="sm"
      />

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

      <Text>Attribute types: {attributeTypes.length}</Text>
      <CreateCollectionTransactionButton
        onSuccess={onSuccess}
        params={{
          metadataProgramId: program.programId,
          name,
          description,
          symbol,
          royalties,
          permittedSigners,
          attributeTypes,
        }}
        formatting={{}}
      />
    </Stack>
  );
};
