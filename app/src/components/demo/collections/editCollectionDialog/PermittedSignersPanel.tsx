import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { usePublicKeyOrNull } from "../../../../hooks/usePublicKeyOrNull";
import { Dispatch, SetStateAction, useState } from "react";
import { abbreviateKey } from  "@libreplex/shared-ui";

export const PermittedSignersPanel = ({
  permittedSigners,
  setPermittedSigners,
}: {
  permittedSigners: PublicKey[];
  setPermittedSigners: Dispatch<SetStateAction<PublicKey[]>>;
}) => {
  const [newPermittedSignerStr, setNewPermittedSignerStr] =
    useState<string>("");

  const newPermittedSigner = usePublicKeyOrNull(newPermittedSignerStr);

  return (
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
        Permitted signers allow the artist / creator to place their digital
        signature on the collection / individual items. This is useful when the
        artist is well known or for other reasons wishes to be identified as the
        creator of the collection / an individual NFT.
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
            onChange={(e) => setNewPermittedSignerStr(e.currentTarget.value)}
          />
        </FormControl>

        {newPermittedSigner && (
          <Button
            colorScheme="teal"
            size="sm"
            disabled={!newPermittedSigner}
            sx={{ mb: 1 }}
            onClick={() => {
              setPermittedSigners((old) => [...old, newPermittedSigner]);
              setNewPermittedSignerStr("");
            }}
          >
            <AddIcon />
          </Button>
        )}
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
              setPermittedSigners((old) =>
                old.filter((_, idx2) => idx2 !== idx)
              );
            }}
          >
            <DeleteIcon />
          </Button>
        </Box>
      ))}
    </Box>
  );
};
