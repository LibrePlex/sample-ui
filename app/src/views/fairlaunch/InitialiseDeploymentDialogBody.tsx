import {
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import BN from "bn.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  HttpClient,
  IOffchainJson,
  getDeploymentPda,
  useDeploymentById,
  useLegacyMetadataByMintId,
  useOffChainMetadataCache,
  usePublicKeyOrNull,
} from "@libreplex/shared-ui";
import { InitialiseDeploymentTransactionButton } from "./InitialiseDeploymentTransactionButton";

export const CreateDeploymentDialogBody = () => {
  const [limitPerMint, setLimitPerMint] = useState<number>(1000);
  const [maxNumberOfTokens, setMaxNumberOfTokens] = useState<number>(21000);

  const [decimals, setDecimals] = useState<number>(9);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [jsonUrl, setJsonUrl] = useState<string>("https://node2.irys.xyz/nMnAaHAJDeDTnGC9mJD9mXPbOQW9aBqpIXHZYftsgeY");
  const [ticker, setTicker] = useState<string>("");
  const [deploymentTemplate, setDeploymentTemplate] = useState<string>("");
  const [mintTemplate, setMintTemplate] = useState<string>("");

  const { connection } = useConnection();
  const [templateMintId, setTemplateMintId] = useState<string>("");
  const templateMintPublicKey = usePublicKeyOrNull(templateMintId);
  const { data: offchainData } = useOffChainMetadataCache(
    templateMintPublicKey
  );
  const { data: metadata } = useLegacyMetadataByMintId(
    templateMintPublicKey,
    connection
  );

  // const fetchFromTemplateMint = useCallback(() => {
  //   alert(
  //     JSON.stringify({
  //       d: metadata?.item?.data,
  //       templateMintPublicKey: templateMintPublicKey.toBase58(),
  //     })
  //   );
  //   if (metadata?.item?.data) {
  //     setJsonUrl(metadata.item.data.uri);
  //   }
  // }, [metadata, templateMintPublicKey]);

  useEffect(() => {
    let active = true;
    (async () => {
      const httpClient = new HttpClient("");
      const { data } = await httpClient.get<IOffchainJson>(
        jsonUrl
      );
      active && setImageUrl(data?.image);
    })();
    return () => {
      active = false;
    };
  }, [jsonUrl]);

  useEffect(() => {
    if (offchainData?.images) {
      setImageUrl(offchainData.images.url);
    }
  }, [offchainData]);
  return (
    <VStack mt={3}>
      <Heading size="md">Create Deployment</Heading>
      <HStack>
        <FormControl as="fieldset">
          <FormLabel as="label">Limit per mint</FormLabel>
          <NumberInput
            value={limitPerMint}
            onChange={(e) => setLimitPerMint(+e)}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <FormControl as="fieldset">
          <FormLabel as="label">Max tokens</FormLabel>
          <NumberInput
            value={maxNumberOfTokens}
            onChange={(e) => setMaxNumberOfTokens(+e)}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <FormControl as="fieldset">
          <FormLabel as="label"># of decimals</FormLabel>
          <NumberInput value={decimals} onChange={(e) => setDecimals(+e)}>
            <NumberInputField />
          </NumberInput>
        </FormControl>
      </HStack>
      <Divider />

      {/* <Text pt={6}>NFT</Text> */}
      {/* <Divider /> */}
      {/* <InputGroup>
        <Input
          sx={{ paddingRight: "30px" }}
          placeholder={"template mint ID"}
          value={templateMintId}
          onChange={(e) => {
            setTemplateMintId(e.currentTarget.value);
          }}
        />
        <InputRightElement width="4.5rem">
          <Button
            isDisabled={!templateMintId}
            h="1.75rem"
            size="sm"
            onClick={fetchFromTemplateMint}
          >
            Fetch
          </Button>
        </InputRightElement>
      </InputGroup> */}

      <Text pt={6}>Ticker</Text>
      <FormControl as="fieldset">
        <FormLabel as="label">Ticker</FormLabel>
        <Input
          placeholder={"lols"}
          value={ticker}
          onChange={(e) => setTicker(e.currentTarget.value)}
        />
      </FormControl>

      <Divider />

      <FormControl as="fieldset">
        <FormLabel as="label">
          Deployment template (op: {'"'}deploy{'"'})
        </FormLabel>
        <Input
          placeholder={
            '{"p":"spl-20","op":"deploy","tick":"wham", "max":"21999999","lim":"1000","dec":"10"}'
          }
          value={deploymentTemplate}
          onChange={(e) => setDeploymentTemplate(e.currentTarget.value)}
        />
      </FormControl>
      <FormControl as="fieldset">
        <FormLabel as="label">
          Mint template (op: {'"'}mint{'"'})
        </FormLabel>
        <Input
          placeholder={
            '{"p":"spl-20","op":"mint","tick":"wham", "max":"21999999","lim":"1000","dec":"10"}'
          }
          value={mintTemplate}
          onChange={(e) => setMintTemplate(e.currentTarget.value)}
        />
      </FormControl>

      <VStack>
        <FormControl as="fieldset">
          <FormLabel as="label">Json URL</FormLabel>
          <Input
            value={jsonUrl}
            onChange={(e) => setJsonUrl(e.currentTarget.value)}
          />
        </FormControl>
        <Image
          alt="deployment"
          height="300px"
          width="300px"
          aspectRatio={"1/1"}
          src={imageUrl}
          fallbackSrc={
            "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
          }
        />
      </VStack>

      <InitialiseDeploymentTransactionButton
        params={{
          input: {
            limitPerMint: new BN(limitPerMint),
            maxNumberOfTokens: new BN(maxNumberOfTokens),
            ticker,
            decimals,
            mintTemplate,
            deploymentTemplate,
            offchainUrl: jsonUrl,
          },
        }}
        formatting={{}}
      />
    </VStack>
  );
};
