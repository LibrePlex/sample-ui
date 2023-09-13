import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CopyPublicKeyButton } from "@libreplex/shared-ui";
import { Keypair } from "@solana/web3.js";


/* 
  Doing this in a browser seems to be unworkable 
  but please feel free to fix if you feel thus inclined.

  Wanted to give the user the option of grinding for their
  own mint but obviously slow af given it's all javascript.

  Leaving it here in case somebody wants to expand / toy with it.

  - neft
*/ 

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

  const [stop, setStop] = useState<boolean>(true);

  const [searchString, setSearchString] = useState<string>("");

  useEffect(() => {
    let mintCandidate = Keypair.generate();
    let t: any;
    (async () => {
      let counter = 0;
      
      while (!stop) {
        if (mintCandidate.publicKey.toBase58().startsWith(searchString)) {
          setGeneratedMint(mintCandidate);
          setStop(true);
          break;
        }
        mintCandidate = Keypair.generate();
        counter++;
        
        if (counter % 1000 === 0) {
          // this is needed to allow the UI to break
          await new Promise<void>((resolve) => {
            console.log('Waiting...')
            t = setTimeout(resolve, 1)
          });
        }
      }
    })();

    return () => {
      setGeneratedMint(mintCandidate);
      if( t) {
        clearTimeout(t);
      }
    };
  }, [stop, searchString]);

  return (
    <Box display="flex" gap={1} flexDir={"column"} p={1}>
      {generatedMint && (
        <CopyPublicKeyButton publicKey={generatedMint.publicKey.toBase58()} />
      )}
      <FormControl>
        <FormLabel>New mint</FormLabel>

        <Input
          placeholder="Starts with"
          value={searchString}
          onChange={(e) => setSearchString(e.currentTarget.value)}
        />
      </FormControl>
      <Button
        onClick={() => {
          setStop(false);
        }}
      >
        {" "}
        Generate
      </Button>
      <Button
        onClick={() => {
          setStop(true);
        }}
      >
        Stop
      </Button>
    </Box>
  );
};
