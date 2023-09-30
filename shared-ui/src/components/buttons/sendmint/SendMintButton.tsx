import { RawAccount, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import BN from "bn.js";
import { IRpcObject } from "../../executor";
import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonProps,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Input,
  HStack,
} from "@chakra-ui/react";

import { usePublicKeyOrNull } from "../../../hooks/usePublicKeyOrNull";
import { SendMintTransactionButton } from "./SendMintTransactionButton";

export const SendMintButton = ({
  item,
  ...rest
}: { item: IRpcObject<RawAccount> } & ButtonProps) => {
  const [targetWallet, setTargetWallet] = useState<string>("");
  const targetWalletPublicKey = usePublicKeyOrNull(targetWallet);
  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button colorScheme="teal" size="xs" {...rest}>
          Send
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>Send this mint</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <HStack>
              <Input
                placeholder="Target wallet"
                value={targetWallet}
                onChange={(e) => setTargetWallet(e.currentTarget.value)}
              />
              {targetWalletPublicKey && (
                <SendMintTransactionButton
                  params={{
                    item,
                    recipient: targetWalletPublicKey,
                    tokenProgram: TOKEN_2022_PROGRAM_ID,
                  }}
                  formatting={{
                    disabled: true,
                  }}
                />
              )}
            </HStack>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
