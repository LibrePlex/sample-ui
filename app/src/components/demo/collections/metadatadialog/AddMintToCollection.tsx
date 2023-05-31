import { AttachmentIcon, CalendarIcon } from "@chakra-ui/icons";
import {
  Box,
  Checkbox,
  Collapse,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IRpcObject } from "components/executor/IRpcObject";
import { usePublicKeyOrNull } from "hooks/usePublicKeyOrNull";
import { Collection } from "query/collections";
import { useState } from "react";
import { MutableInfoPanel } from "./MutableInfoDialog";
import { RoyalOverridePanel } from "./RoyaltyOverridePanel";

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
        <Text>Adding new mints is not currently supported by the UI.
        </Text>
        <Text>Coming soon!
        </Text>

    </Box>
  );
};
