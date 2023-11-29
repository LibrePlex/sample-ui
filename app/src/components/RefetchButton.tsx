import { IconButton } from "@chakra-ui/react";
import { TbRefresh } from "react-icons/tb";

export const RefetchButton = ({
  refetch,
  
}: {
  refetch: () => any;
  
}) => {
  return <IconButton
      aria-label="refresh offchain metadata"
      size="sm"
      onClick={() => refetch()}
    >
      <TbRefresh />
    </IconButton>
};
