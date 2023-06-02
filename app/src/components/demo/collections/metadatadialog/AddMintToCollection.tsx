import { AttachmentIcon, CalendarIcon } from "@chakra-ui/icons";
import {
  Box,
  Checkbox,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import { IRpcObject } from "components/executor/IRpcObject";
import { usePublicKeyOrNull } from "hooks/usePublicKeyOrNull";
import { Collection } from "query/collections";
import { useState } from "react";
import { MutableInfoPanel } from "./MutableInfoDialog";

export const AddMintToCollection = ({
  collection,
}: {
  collection: IRpcObject<Collection>;
}) => {
  const [mintId, setMintId] = useState<string>(
    "BTRmFWBPzXhGr3s6iJr9K9KvgLFGm18nBBxqS5GRT4wb"
  );

  const mintPublicKey = usePublicKeyOrNull(mintId);
  const [name, setName] = useState<string>("");

  const [url, setUrl] = useState<string>("");

  //   const {} = useFetchMultiAccounts()
  const [isMutable, setIsMutable] = useState<boolean>(false);

  return (
    <Box display="flex" rowGap={1} flexDirection="column">
      <Box display='flex'  justifyContent={'center'}>
        {collection.item.nftCollectionData ? (
          <Text sx={{ fontSize: "18px" }}>Nft collection</Text>
        ) : (
          <Text sx={{ fontSize: "18px" }}>Spl collection</Text>
        )}
      </Box>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <CalendarIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Mint Id"
          value={mintId}
          onChange={(e) => setMintId(e.currentTarget.value)}
        />
      </InputGroup>
      {mintId.length > 0 && !mintPublicKey && (
        <Text color="red">Please input a valid mint Id</Text>
      )}

      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <CalendarIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Metadata name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
      </InputGroup>
      {/* <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Text color="gray.300">S</Text>
        </InputLeftElement>
        <Input
          placeholder="Symbol name"
          value={symbol}
          onChange={(e) => setSymbol(e.currentTarget.value)}
        />
      </InputGroup> */}

      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <AttachmentIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.currentTarget.value)}
        />
      </InputGroup>

      <Box
        display="flex"
        alignItems="center"
        flexDirection="row"
        sx={{ justifyContent: "space-between" }}
        columnGap={2}
      >
        <Checkbox
          checked={isMutable}
          onChange={(e) => {
            setIsMutable(e.currentTarget.checked);
          }}
          colorScheme="red"
        >
          Mutable
        </Checkbox>
        <MutableInfoPanel />
      </Box>
      {/* <Box>{collection.item.nftCollectionData? }</Box> */}
    </Box>
  );
};
