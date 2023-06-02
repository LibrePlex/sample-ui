import { AttachmentIcon, CalendarIcon } from "@chakra-ui/icons";
import {
  Alert,
  Box,
  Checkbox,
  Collapse,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import { Keypair, PublicKey } from "@solana/web3.js";
import { KeyGenerator } from "components/KeyGenerator";
import { IRpcObject } from "components/executor/IRpcObject";
import { Collection } from "query/collections";
import { useEffect, useMemo, useState } from "react";
import { CreateMetadataButton } from "./CreateMetadataButton";
import { MutableInfoPanel } from "./MutableInfoDialog";
import { RoyalOverridePanel } from "./RoyaltyOverridePanel";
import { AttributeSelectorPanel } from "./AttributeSelectorPanel";
import { generateKey } from "crypto";
import { CopyPublicKeyButton } from "components/buttons/CopyPublicKeyButton";
import { MintImageUploader } from "components/shadowdrive/MintImageUploader";

enum Status {
  NotStarted,
  Processing,
  Success,
}

enum UrlMode {
  Shadow,
  String
}
export const MintNewToCollection = ({
  collection,
}: {
  collection: IRpcObject<Collection>;
}) => {
  const [generatedMint, setGeneratedMint] = useState<Keypair>(
    Keypair.generate()
  );

  const [status, setStatus] = useState<Status>(Status.NotStarted);

  const [name, setName] = useState<string>("");

  const [url, setUrl] = useState<string>("");

  //   const {} = useFetchMultiAccounts()
  const [isMutable, setIsMutable] = useState<boolean>(false);

  const numberOfAttributes = useMemo(
    () => collection?.item?.nftCollectionData?.attributeTypes?.length ?? 0,
    [collection]
  );


  const [urlMode, setUrlMode] = useState<UrlMode>(UrlMode.Shadow);

  useEffect(() => {
    setStatus(Status.NotStarted);
  }, [generatedMint]);

  const [attributes, setAttributes] = useState<number[]>([
    ...Array(numberOfAttributes),
  ]);

  const [selectedMint, setSelectedMint] = useState<Keypair>();

  return (
    <Box display="flex" rowGap={1} flexDirection="column">
      <Box display="flex" justifyContent={"center"}>
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
          placeholder="Metadata name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
      </InputGroup>
      {urlMode === UrlMode.String ? (
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
      ) : (
        <MintImageUploader mintId={generatedMint.publicKey.toBase58()} fileId={"file.png"} afterUpdate={ () =>{} } />
      )}

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
      <AttributeSelectorPanel
        attributes={attributes}
        setAttributes={setAttributes}
        collection={collection}
      />

      <Collapse in={collection.item.nftCollectionData !== undefined}>
        <RoyalOverridePanel />
      </Collapse>

      <KeyGenerator
        generatedMint={generatedMint}
        setGeneratedMint={setGeneratedMint}
      />

      <CreateMetadataButton
        beforeClick={() => {
          setStatus(Status.Processing);
          setSelectedMint(generatedMint);
        }}
        onSuccess={() => {
          setStatus(Status.Success);
        }}
        params={{
          name,
          url,
          attributes,
          collection: collection.pubkey,
          mint: generatedMint,
        }}
        formatting={{
          isDisabled: status !== Status.NotStarted,
        }}
      />

      {status === Status.Success && selectedMint && (
        <Alert
          status="success"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text>Metadata added to mint:</Text>
          <Box p={1}>
            <CopyPublicKeyButton
              publicKey={selectedMint.publicKey.toBase58()}
            />
          </Box>
          <Text>Please generate a new key to create another.</Text>
        </Alert>
      )}
    </Box>
  );
};
