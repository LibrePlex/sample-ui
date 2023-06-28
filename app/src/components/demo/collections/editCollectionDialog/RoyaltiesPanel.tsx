import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  NumberInput,
  NumberInputField,
  Stack,
  Text
} from "@chakra-ui/react";
import { usePublicKeyOrNull } from "../../../../hooks/usePublicKeyOrNull";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { RoyaltyShare, abbreviateKey } from "shared-ui";

export const RoyaltiesPanel = ({
  royaltyBps,
  setRoyaltyBps,
  royaltyShares,
  setRoyaltyShares
}: {
  royaltyBps: number;
  setRoyaltyBps: Dispatch<SetStateAction<number>>;
  royaltyShares: RoyaltyShare[];
  setRoyaltyShares: Dispatch<SetStateAction<RoyaltyShare[]>>;
}) => {
  const [royaltyRecipientStr, setRoyaltyRecipientStr] = useState<string>(
    "7XD9dmZKK6fDGAtbjJX8KxDFy3zAjBAoLsAu748nNfEV"
  );

  const totalShares = useMemo(
    () => royaltyShares.reduce((a, b) => a + b.share, 0),
    [royaltyShares]
  );

  const royaltyRecipient = usePublicKeyOrNull(royaltyRecipientStr);

  return (
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

        {royaltyRecipient && (
          <Button
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
          </Button>
        )}
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
              setRoyaltyShares(royaltyShares.filter((_, idx2) => idx2 !== idx));
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
    </Stack>
  );
};
