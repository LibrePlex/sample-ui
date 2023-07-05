import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { IRpcObject, Price, useMetadataById } from "shared-ui";
import { RawAccount } from "@solana/spl-token";
import React, { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useMetadataByMintId } from "shared-ui/src/sdk/query/metadata";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AssetDisplay } from "./assetdisplay/AssetDisplay";
import { ListMintTransactionButton } from "./ListMintTransactionButton";
import { PriceSelector } from "./PriceSelector";

export const MintCard = ({
  tokenAccount,
}: {
  tokenAccount: IRpcObject<RawAccount>;
}) => {
  const { connection } = useConnection();
  const metadata = useMetadataByMintId(tokenAccount.item.mint, connection);
  const [price, setPrice] = useState<Price>({
    native: {
      lamports: BigInt(1_000_000_000),
    },
  });

  const [solAmount, setSolAmount] = useState<bigint>(BigInt(1));

  useEffect(() => {
    setPrice({
      native: { lamports: solAmount * BigInt(10 ** 9) },
    });
  }, [solAmount]);

  return (
    <Box maxW={"300px"}>
      {metadata?.item?.asset && <AssetDisplay asset={metadata.item?.asset} />}

      <VStack>
        <Heading>{metadata?.item?.name}</Heading>
        <HStack justifyContent={"space-between"} alignItems='end' p={2}>
          <FormControl>
            <FormLabel>Amount</FormLabel>
            <NumberInput
              min={0}
              placeholder="Sol amount"
              value={solAmount.toString()}
              onChange={(e) => {
                setSolAmount(BigInt(e));
              }}
            >
              <NumberInputField />
              <Text sx={{position: "absolute", right: 2, top: '50%', transform :"translate(0%,-50%)"}}>SOL</Text>
            </NumberInput>
          </FormControl>

          <PriceSelector price={price} setPrice={setPrice} />
          <ListMintTransactionButton
            params={{
              mint: tokenAccount.item.mint,
              tokenAccount: tokenAccount.pubkey,
              amount: BigInt(1),
              price,
            }}
            formatting={{}}
          />
        </HStack>
      </VStack>
    </Box>
  );
};
