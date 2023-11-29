import {
  Text,
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  SimpleGrid,
  Box,
  HStack,
  Tbody,
  Tr,
  Table,
  Th,
  Td,
  Button,
  CardFooter,
  Image,
  Stack,
} from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import NextLink from "next/link";
import { useDeploymentById } from "shared-ui/src";
import { CreateNewCard } from "./CreateNewCard";

export const ValidatorCard = ({
  publicKey,
  index,
}: {
  publicKey: PublicKey;
  index: number;
}) => {
  const { connection } = useConnection();
  const { data, refetch } = useDeploymentById(publicKey, connection);

  return (
    <Box>
      {/* <Box className="absolute top-1 right-1 z-100">
          <RefetchButton refetch={refetch} />
        </Box> */}
      {data?.item === undefined ? (
        <CreateNewCard/>
      ) : (
        <></>
        // <DisplayValidatorCard publicKey={publicKey} />
      )}
    </Box>
  );
};
