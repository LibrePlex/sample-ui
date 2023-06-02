import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CopyPublicKeyButton } from "./buttons/CopyPublicKeyButton";
import { Keypair } from "@solana/web3.js";

export const KeyGenerator = ({
  generatedMint,
  setGeneratedMint,
}: {
  generatedMint: Keypair | undefined;
  setGeneratedMint: Dispatch<SetStateAction<Keypair | undefined>>;
}) => {
  useEffect(() => {
    setGeneratedMint(Keypair.generate());
  }, []);

  const generateKey = () => {
    setGeneratedMint(Keypair.generate())
  }
    
  return (
    <Box display="flex" gap={1} flexDir={"column"} p={1}>
      <Box p={2} display={'flex'} justifyContent={'center'}>
      {generatedMint && (
        <CopyPublicKeyButton publicKey={generatedMint.publicKey.toBase58()} />
      )}
      </Box>
      
      <Button
        onClick={() => {
          generateKey()
        }}
      >
        {" "}
        Generate mint key
      </Button>
    </Box>
  );
};
