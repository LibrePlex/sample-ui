import { FormControl, FormLabel, HStack, Input, NumberInput, NumberInputField, Text, VStack } from "@chakra-ui/react";
import { CopyPublicKeyButton, IRpcObject } from "shared-ui/src";
import { Validator } from "./useLegacyValidators";
import { MigrateFromLegacyTransactionButton } from "./MigrateFromLegacyTransactionButton";
import { useEffect, useMemo, useState } from "react";
import { UpdateFromLegacyTransactionButton } from "./UpdateFromLegacyTransactionButton";
export const ValidatorImporterDetail = ({
  item,
}: {
  item: IRpcObject<Validator>;
}) => {
  const [limitPerMint, setLimitPerMint] = useState<number>(1000);
  const [tick, setTick] = useState<string>("");


  useEffect(() => {
    let tickerParsed: { amt: number; tick: string } = undefined;

    try {
      tickerParsed = JSON.parse(item.item.ticker);
      setLimitPerMint(tickerParsed.amt);
      setTick(tickerParsed.tick)
    } catch (e) {
      setLimitPerMint(1000);
    }
  }, [item.item]);

  const offChainUrl = useMemo(()=>item.item.jsonUrl,[item.item])

  return (
    <VStack>
      <CopyPublicKeyButton publicKey={item.pubkey.toBase58()} />{" "}
      <Text>{item.item.nftName}</Text>
      <Text maxW="200px">{item.item.ticker}</Text>
      <Text maxW="200px">{item.item.validationCountCurrent}/{item.item.validationCountMax}</Text>
      <FormControl>
            <FormLabel>Limit per mint</FormLabel>
            <NumberInput
              min={0}
              value={limitPerMint}
              onChange={(value) => setLimitPerMint(+value)}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
      <MigrateFromLegacyTransactionButton
        params={{ validator: item, limitPerMint }}
        formatting={{}}
      />
       <UpdateFromLegacyTransactionButton
        params={{ validator: {...item, item: {
          ...item.item,
          ticker: tick
        }}, offChainUrl }}
        formatting={{}}
      />
    </VStack>
  );
};
