import { Button, ButtonProps, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Portal } from "@chakra-ui/react";
import { RawAccount } from "@solana/spl-token";
import { WalletAction } from "./WalletAction";
import { IRpcObject } from "@libreplex/shared-ui";

export const ListMintButton = ({ item, ...rest }: { item: IRpcObject<RawAccount> } & ButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button colorScheme="teal" size="xs">
          List
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>List</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <WalletAction item={item} />
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
