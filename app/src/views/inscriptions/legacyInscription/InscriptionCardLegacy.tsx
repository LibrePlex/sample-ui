import { BoxProps } from "@chakra-ui/react";
import {
  useInscriptionById
} from "@libreplex/shared-ui";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ReactNode } from "react";
import { EditLegacyInscription } from "./EditLegacyInscription";
import { MintCardLegacy } from "./MintCardLegacy";

const textMotion = {
  default: {
    color: "#ffffff",
  },
  hover: {
    color: "#9448FF",
  },
};

export const InscriptionCardLegacy = ({
  inscriptionId,
  children,
}: {
  inscriptionId: PublicKey;

  children?: ReactNode;
} & BoxProps) => {
  const { connection } = useConnection();

  const inscription = useInscriptionById(inscriptionId, connection);

  return (
    <MintCardLegacy mintId={inscription?.item.root}>
      <EditLegacyInscription mint={inscription?.item.root} />
    </MintCardLegacy>
  );
};
