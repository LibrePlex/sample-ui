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

  const { connection } = useConnection();
  const { ownerPublicKey } = useContext(ShopOwnerContext);

  const [selectedListingGroup, setSelectedListingGroup] =
    useState<IRpcObject<ListingGroup>>();

  const { data: groups } = useListingGroupsByAdmin(ownerPublicKey, connection);

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

  const activeGroupFilters = useListingFiltersByGroup(
    selectedListingGroup?.pubkey ?? null,
    connection
  );

  useEffect(() => {
    console.log({ activeGroupFilters });
  }, [activeGroupFilters]);

  const metadata = useMetadataByMintId(item.item?.mint, connection);

  const activeFilter = useMemo(() => {
    const g = metadata?.item?.group;
    return g
      ? activeGroupFilters.data.find((item) =>
          item.item?.filterType?.group?.pubkey.equals(g)
        )
      : undefined;
  }, [activeGroupFilters, metadata]);

  return (
    <HStack justifyContent={"start"} alignItems="end" p={2}>
      <VStack alignItems={"start"}>
        <Text>Choose group</Text>
        <HStack>
          {groups
            .filter((item) => item.item)
            .map((item) => (
              <Button
                colorScheme="teal"
                variant={
                  selectedListingGroup?.pubkey.equals(item.pubkey)
                    ? "solid"
                    : "outline"
                }
                onClick={() => {
                  setSelectedListingGroup({ ...item, item: item.item! });
                }}
              >
                {item.item?.name}
              </Button>
            ))}
        </HStack>

        <Collapse in={selectedListingGroup !== undefined}>
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
        </Collapse>

        <PriceSelector price={price} setPrice={setPrice} />

        {selectedListingGroup &&
          (activeFilter ? (
            <ListMintTransactionButton
              params={{
                mint: item.item!.mint,
                tokenAccount: item.pubkey,
                amount: BigInt(1),
                price,
                listingGroup: selectedListingGroup.pubkey,
                listingFilter: activeFilter.pubkey,
              }}
              formatting={{}}
            />
          ) : (
            <Text>This item cannot be listed here</Text>
          ))}
      </VStack>
    </HStack>
  );
};
