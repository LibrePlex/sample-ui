import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Collection } from "query/collections";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { AttributeTypeRow } from "./AttributeTypeRow";
import { AddIcon, CalendarIcon } from "@chakra-ui/icons";

export const AttributesPanel = ({
  attributeTypes,
  setAttributeTypes,
}: {
  attributeTypes: Collection["nftCollectionData"]["attributeTypes"];
  setAttributeTypes: Dispatch<
    SetStateAction<Collection["nftCollectionData"]["attributeTypes"]>
  >;
}) => {
  const [name, setName] = useState<string>("");
  const [attributeValues, setAttributeValues] = useState<string>("");

  const [attributeValueStr, setAttributeValueStr] = useState<string>("");

  const attributeValueSet = useMemo(
    () =>
      new Set(attributeValueStr.split(",").map(item=>item.trim()).filter((item) => item.length > 0)),
    [attributeValueStr]
  );

  const sortedAttributes = useMemo(
    () => [...attributeValueSet].sort((a, b) => a.localeCompare(b)),
    [attributeValueSet]
  );

  const nameExists = useMemo(
    () => attributeTypes.find((item) => item.name === name) !== undefined,
    [name, attributeTypes]
  );

  return (
    <Stack>
      <Table >
        <Thead>
            <Tr>
                <Td>
                    Attribute
                </Td>
                <Td>
                    Permitted values
                </Td>
                <Td>
                    
                </Td>
            </Tr>
        </Thead>
        <Tbody>
          {attributeTypes.map((item, idx) => (
            <AttributeTypeRow
            key={idx}
              item={item}
              setAttributeTypes={setAttributeTypes}
            />
          ))}
        </Tbody>
      </Table>

      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Text color="gray.300">N</Text>
        </InputLeftElement>
        <Input
          placeholder="Attribute name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />

        <Button
          colorScheme="teal"
          isDisabled={name.length === 0 || nameExists}
          onClick={() => {
            if (sortedAttributes.length > 0) {
              setAttributeTypes((old) => [
                ...old,
                {
                  name,
                  permittedValues: sortedAttributes,
                  deleted: false,
                  continuedAtIndex: null,
                  continuedFromIndex: null,
                },
              ]);
              setName("");
              setAttributeValueStr("");
            }
          }}
        >
          <AddIcon />
        </Button>
      </InputGroup>
      {nameExists && (
        <Text colorScheme="red">Attribute {name} already exists</Text>
      )}
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Text color="gray.300">V</Text>
        </InputLeftElement>
        <Input
          placeholder="Allowed values (comma separated)"
          value={attributeValueStr}
          onChange={(e) => setAttributeValueStr(e.currentTarget.value)}
        />
      </InputGroup>

      {sortedAttributes.length > 0 && "Values:"}
      <Box display="flex" gap={1}>
        

        {sortedAttributes.map((item, idx) => (
          <Tag key={idx} onClick={() => {}}>{item}</Tag>
        ))}
      </Box>
      <Box p={1}>
        <Text>
          NB: The LibrePlex standard allows for flexible layer generation via
          modular rendering programs. You do not need to worry about the
          ordering of layers here as that is delegated to the rendering engine.
        </Text>
      </Box>
    </Stack>
  );
};
