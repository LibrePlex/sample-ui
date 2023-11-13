import { BoxProps } from "@chakra-ui/react";
import { useInscriptionById } from "@libreplex/shared-ui";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ReactNode } from "react";
import { ViewLegacyInscription } from "./ViewLegacyInscription";
import { MintCardLegacy } from "./MintCardLegacy";
import { DisappearingBox } from "@app/components/DisappearingBox";

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

  const {data: inscription} = useInscriptionById(inscriptionId, connection);

  return (
    <DisappearingBox>
      <MintCardLegacy mintId={inscription?.item.root}>
        {/* <ViewLegacyInscription mint={inscription?.item.root} /> */}
      </MintCardLegacy>
    </DisappearingBox>
  );
};
