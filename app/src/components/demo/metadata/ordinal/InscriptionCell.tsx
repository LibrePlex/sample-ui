import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { IRpcObject } from "@/components/executor/IRpcObject";
import { Inscription} from "shared-ui";

export const InscriptionCell = ({ inscription }: { inscription: IRpcObject<Inscription> }) => {
  
  return (
    <>
    
      {inscription? `Ordinal [${inscription?.item.size.toLocaleString() ?? "-"} bytes]`:''}
    </>
  );
};
