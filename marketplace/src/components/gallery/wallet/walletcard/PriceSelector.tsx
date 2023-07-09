import { HStack, VStack } from "@chakra-ui/react";
import React from "react";
import { Dispatch, SetStateAction } from "react";
import { Price } from "shared-ui";

export const PriceSelector = ({
  price,
  setPrice,
}: {
  price: Price;
  setPrice: Dispatch<SetStateAction<Price>>;
}) => {
  return (
    <VStack>
      <HStack></HStack>
    </VStack>
  );
};
