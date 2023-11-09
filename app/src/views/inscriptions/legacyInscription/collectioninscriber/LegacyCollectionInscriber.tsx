import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Textarea,
  Th,
  Tr,
  VStack,
  Text,
} from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useState } from "react";
import { CopyPublicKeyButton, notify } from "@libreplex/shared-ui";
import { MintMigratorRow } from "./MintMigratorRow";

export const LegacyCollectionInscriber = () => {
  const [mintIds, setMintIds] = useState<PublicKey[]>([]);
  const [errors, setErrors] = useState<{ i: string; e: string }[]>([]);
  const [inputTxt, setInputTxt] = useState<string>(
    '["6LWDWUAMVXD1r66SvaEibpR1dq1bhRM1v724qmGeoAiD"]'
  );

  const processInput = useCallback(() => {
    const _errors: { i: string; e: string }[] = [];
    const _mintIds = new Set<string>();
    try {
      const inputJson = JSON.parse(inputTxt);
      setInputTxt(JSON.stringify(inputJson, undefined, 4));
      for (const i of inputJson) {
        try {
          console.log({ i });
          _mintIds.add(new PublicKey(i).toBase58());
        } catch (e) {
          _errors.push({ i, e: (e as Error).message });
        }
      }
    } catch (e) {
      notify({
        type: "error",
        message:
          "Could not parse hashlist. Please check the format and try again",
      });
    }
    setErrors(_errors);
    setMintIds(
      [..._mintIds]
        .sort((a, b) => a.localeCompare(b))
        .map((item) => new PublicKey(item))
    );
  }, [inputTxt]);

  return (
    <VStack rowGap={2} mt={2}>
      <Box>
        <Button onClick={() => processInput()}>Process</Button>
      </Box>
      {mintIds.length === 0 && (
        <Textarea
          size="md"
          cols={40}
          rows={20}
          placeholder="Paste the hashlist of the mint ids you would like to inscribe in standard ME hashlist/json format (starting with [ and ending with ]). Don't worry about duplicates as these will be ignored."
          value={inputTxt}
          onChange={(e) => {
            setInputTxt(e.currentTarget.value);
          }}
        />
      )}
      {mintIds.length > 0 && (
        <Table>
          <Tbody>
            <Tr>
              <Th colSpan={1}>
                <Text color="#aaa">Mint count</Text>
              </Th>
              <Td>{mintIds.length}</Td>
              <Td colSpan={2}></Td>
            </Tr>
            {mintIds.map((m, i) => (
              <MintMigratorRow mint={m} key={i}/>
            ))}
            {errors.map((e, idx) => (
              <Tr key={idx}>
                <Td>
                  <CopyPublicKeyButton publicKey={e.i} />
                </Td>
                <Td>{e.e}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </VStack>
  );
};
