import { BoxProps, Text } from "@chakra-ui/react";
import {
  LegacyMint,
  decodeInscription
} from "@libreplex/shared-ui";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ReactNode, useContext, useMemo } from "react";
import { InscriptionsProgramContext } from "shared-ui/src/sdk/query/inscriptions/InscriptionsProgramContext";
import { useFetchSingleAccount } from "shared-ui/src/sdk/query/singleAccountInfo";
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

  const program = useContext(InscriptionsProgramContext);
  const inscriptionAccount = useFetchSingleAccount(inscriptionId, connection);
  const inscription = useMemo(
    () =>
      inscriptionId &&
      inscriptionAccount?.data?.item?.buffer &&
      decodeInscription(program)(
        inscriptionAccount?.data?.item?.buffer,
        inscriptionId
      ),
    [inscriptionId, inscriptionAccount?.data?.item?.buffer, program]
  );

  return (
    <MintCardLegacy mintId={inscription?.item.root}>
        <EditLegacyInscription
          mint={inscription?.item.root}
      
        />

    </MintCardLegacy>
  );
};
