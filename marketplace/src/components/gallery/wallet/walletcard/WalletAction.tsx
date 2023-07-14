import {
  Button,
  Collapse,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  NumberInput,
  NumberInputField,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  IRpcObject,
  ListingGroup,
  Price,
  useListingGroupsByAdmin,
  useMetadataByMintId,
} from "shared-ui";
import { RawAccount } from "@solana/spl-token";
import { PriceSelector } from "./PriceSelector";
import { ListMintTransactionButton } from "./ListMintTransactionButton";
import { ShopOwnerContext } from "../../../ShopOwnerContext";
import BN from "bn.js";
import {
  ListingFilter,
  useListingFiltersByGroup,
} from "shared-ui/src/sdk/query/shop/listingFilter";

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
            <InputRightAddon children="SOL" />
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
