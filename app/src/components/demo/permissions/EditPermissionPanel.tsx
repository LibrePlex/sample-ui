import { AddIcon, CalendarIcon, DeleteIcon } from "@chakra-ui/icons";
import { useMemo, useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControl,
  FormLabel,
  Heading,
  InputGroup,
  InputLeftElement,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
} from "@chakra-ui/react";

import { Input } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";

import { useWallet } from "@solana/wallet-adapter-react";
import { RoyaltyShare } from "shared-ui";
import { usePublicKeyOrNull } from "hooks/usePublicKeyOrNull";
import { abbreviateKey } from "shared-ui";
import { CreateCollectionTransactionButton } from "./CreatePermissionButton";

export const EditCollectionPanel = ({onSuccess}:{onSuccess: () => any;}) => {
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");

  const [collectionUrl, setCollectionUrl] = useState<string>("");
  const [isNftCollection, setIsNftCollection] = useState<boolean>(false);

  const [royaltyRecipientStr, setRoyaltyRecipientStr] = useState<string>(
    "7XD9dmZKK6fDGAtbjJX8KxDFy3zAjBAoLsAu748nNfEV"
  );

  const [royaltyBps, setRoyaltyBps] = useState<number>(500);
  const [royaltyShares, setRoyaltyShares] = useState<RoyaltyShare[]>([]);
  const [permittedSigners, setPermittedSigners] = useState<PublicKey[]>([]);

  const [newPermittedSignerStr, setNewPermittedSignerStr] =
    useState<string>("");

  const royaltyRecipient = usePublicKeyOrNull(royaltyRecipientStr);

  const totalShares = useMemo(
    () => royaltyShares.reduce((a, b) => a + b.share, 0),
    [royaltyShares]
  );

  const [validated, setValidated] = useState<boolean>(false);

  const newPermittedSigner = usePublicKeyOrNull(newPermittedSignerStr);

  const nftCollectionData = useMemo(
    () =>
      isNftCollection && permittedSigners && royaltyShares
        ? {
            royaltyBps,
            royaltyShares,
            permittedSigners,
          }
        : null,
    [isNftCollection, permittedSigners, royaltyShares, royaltyBps]
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
          <CalendarIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Symbol name"
          value={symbol}
          onChange={(e) => setSymbol(e.currentTarget.value)}
        />
      </InputGroup>
      {validated && symbol.length === 0 && (
        <Text color="red">Symbol cannot be empty</Text>
      )}

      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <CalendarIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="URL"
          value={collectionUrl}
          onChange={(e) => setCollectionUrl(e.currentTarget.value)}
        />
      </InputGroup>
      {validated && collectionUrl.length === 0 && (
        <Text color="red">Url cannot be empty</Text>
      )}
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
        <Text pb={3}>
          Compared to the legacy standard, permitted signers
          in LibrePlex are completely independent of royalty recipients. So, no more creators with 0% royalties!
        </Text>
        <Stack>
          <Heading fontSize="xl">Royalties</Heading>
          <FormControl>
            <FormLabel>Royalties (basis points 0-10000)</FormLabel>
            <NumberInput
              min={0}
              max={10000}
              value={royaltyBps}
              onChange={(value) => setRoyaltyBps(+value)}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
          <Text>{(royaltyBps / 100).toFixed(2)}%</Text>
          <Heading fontSize="lg">Royalty recipients</Heading>
          <Box
            sx={{
              display: "flex",
              alignItems: "end",
              width: "100%",
              justifyContent: "space-between",
            }}
            columnGap={2}
          >
            <FormControl>
              <FormLabel>New recipient</FormLabel>

              <Input
                placeholder="Recipient public key"
                value={royaltyRecipientStr}
                onChange={(e) => setRoyaltyRecipientStr(e.currentTarget.value)}
              />
            </FormControl>

            {royaltyRecipient && <Button
              colorScheme="teal"
              size="sm"
              sx={{ mb: 1 }}
              onClick={() => {
                setRoyaltyShares((royaltyShares) => [
                  ...royaltyShares,
                  {
                    recipient: royaltyRecipient,
                    share: royaltyShares.length > 0 ? 0 : 10000,
                  },
                ]);
                setRoyaltyRecipientStr("");
              }}
            >
              <AddIcon />
            </Button>}
          </Box>
          {royaltyRecipientStr.length > 0 && !royaltyRecipient && (
            <Text color="red">Please input a valid public key</Text>
          )}
          Royalty recipients: {royaltyShares.length}
          {royaltyShares.map((item, idx) => (
            <Box
              key={idx}
              sx={{ width: "100%" }}
              display="flex"
              justifyContent={"space-between"}
              alignItems={"center"}
              columnGap={2}
            >
              {abbreviateKey(item.recipient.toBase58(), 6)}
              <Text>Share</Text>
              <InputGroup>
                <NumberInput
                  min={0}
                  max={10000}
                  value={item.share}
                  onChange={(value) =>
                    setRoyaltyShares((old) =>
                      old.map((item, idx2) =>
                        idx === idx2
                          ? {
                              ...item,
                              share: +value,
                            }
                          : item
                      )
                    )
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </InputGroup>
              {/* </FormControl> */}
              <Button
                colorScheme="red"
                size="sm"
                onClick={() => {
                  setRoyaltyShares(
                    royaltyShares.filter((_, idx2) => idx2 !== idx)
                  );
                }}
              >
                <DeleteIcon />
              </Button>
            </Box>
          ))}
          {royaltyShares.length === 0 ? (
            <Text color="red">Please add at least one royalty recipient.</Text>
          ) : (
            totalShares !== 10000 && (
              <Text color="red">Total shares must add up to 10000</Text>
            )
          )}
          <Heading fontSize="xl">Permitted signers</Heading>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "end",
              width: "100%",
              justifyContent: "space-between",
            }}
            columnGap={2}
          >
            <Text sx={{ pb: 2 }}>
              Permitted signers allow the artist / creator to place their
              digital signature on the collection / individual items. This is
              useful when the artist is well known or for other reasons wishes
              to be identified as the creator of the collection / an individual
              NFT.
            </Text>

            <Box
              sx={{ display: "flex", width: "100%", alignItems: "end" }}
              columnGap={2}
            >
              <FormControl>
                <FormLabel>New permitted signer</FormLabel>

                <Input
                  placeholder="Permitted signer public key"
                  value={newPermittedSignerStr}
                  onChange={(e) =>
                    setNewPermittedSignerStr(e.currentTarget.value)
                  }
                />
              </FormControl>

              {newPermittedSigner && <Button
                colorScheme="teal"
                size="sm"
                disabled={!newPermittedSigner}
                sx={{ mb: 1 }}
                onClick={() => {
                  setPermittedSigners((old) => [
                    ...old,
                    newPermittedSigner,
                  ]);
                  setNewPermittedSignerStr("");
                }}
              >
                <AddIcon />
              </Button>}
            </Box>
          </Box>
          {newPermittedSignerStr.length > 0 && !newPermittedSigner && (
            <Text color="red">Please input a valid public key</Text>
          )}
          {permittedSigners.map((item, idx) => (
            <Box
              key={idx}
              sx={{ width: "100%" }}
              display="flex"
              justifyContent={"space-between"}
              alignItems={"center"}
              columnGap={2}
            >
              {abbreviateKey(item.toBase58(), 6)}
              {/* </FormControl> */}
              <Button
                colorScheme="red"
                size="sm"
                onClick={() => {
                  setRoyaltyShares(
                    royaltyShares.filter((_, idx2) => idx2 !== idx)
                  );
                }}
              >
                <DeleteIcon />
              </Button>
            </Box>
          ))}
        </Stack>
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
