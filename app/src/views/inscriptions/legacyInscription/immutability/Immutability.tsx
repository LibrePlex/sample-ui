import {
  Button,
  Center,
  HStack,
  Heading,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Skeleton,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { HiLockClosed, HiLockOpen } from "react-icons/hi2";
import { IRpcObject, Inscription, SolscanLink } from "@libreplex/shared-ui";
import { SystemProgram } from "@solana/web3.js";

import { useMemo } from "react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { TbRefresh } from "react-icons/tb";
import { MutableInscription } from "./MutableInscription";
import { ImmutableInscription } from "./ImmutableInscription";

export const Immutability = ({
  inscription,
}: {
  inscription: IRpcObject<Inscription>;
}) => {
  const isMutable = useMemo(
    () => !inscription.item?.authority.equals(SystemProgram.programId),
    [inscription]
  );

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton aria-label={isMutable ? "mutable" : "immutable"} >
          {isMutable ? <HiLockOpen color='#e11' /> : <HiLockClosed color='#1c1'/>}
        </IconButton>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>
            <HStack>
              {isMutable ? <HiLockOpen /> : <HiLockClosed />}
              <Heading size="md">{isMutable ? "mutable" : "immutable"}</Heading>
            </HStack>
          </PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            {isMutable ? (
              <MutableInscription inscription={inscription}></MutableInscription>
            ) : (
              <ImmutableInscription></ImmutableInscription>
            )}
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
