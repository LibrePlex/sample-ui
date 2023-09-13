import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightAddon
} from "@chakra-ui/react";

import { RawAccount } from "@solana/spl-token";
import BN from "bn.js";
import { useEffect, useState } from "react";
import {
  IRpcObject,
  Price
} from  "@libreplex/shared-ui";
import { ListMintTransactionButton } from "./ListMintTransactionButton";

export const WalletAction = ({ item }: { item: IRpcObject<RawAccount> }) => {
  const [price, setPrice] = useState<Price>({
    native: {
      lamports: new BN(1_000_000_000),
    },
  });

  const [solAmount, setSolAmount] = useState<string>("1");

  useEffect(() => {
    try {
      console.log({ solAmount });
      setPrice({
        native: {
          lamports: new BN(Math.ceil(parseFloat(solAmount) * Number(10 ** 9))),
        },
      });
    } catch (e) {}
  }, [solAmount]);

  return (
    <HStack justifyContent={"start"} alignItems="end" p={2}>
      <FormControl>
        <FormLabel>Amount</FormLabel>
        <InputGroup>
          <Input
            min={0}
            step={0.0001}
            placeholder="Sol amount"
            value={solAmount}
            onChange={(e) => {
              setSolAmount(e.currentTarget.value);
            }}
          />
          <InputRightAddon>SOL</InputRightAddon>
        </InputGroup>
      </FormControl>

      {/* <PriceSelector price={price} setPrice={setPrice} /> */}

      <ListMintTransactionButton
        params={{
          mint: item.item!.mint,
          tokenAccount: item.pubkey,
          amount: BigInt(1),
          price,
        }}
        formatting={{}}
      />
    </HStack>
  );
};
