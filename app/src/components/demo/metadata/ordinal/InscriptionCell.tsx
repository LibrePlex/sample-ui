import { IdlAccounts } from "@coral-xyz/anchor";
import { IRpcObject, Inscription } from "shared-ui";



export const InscriptionCell = ({
  inscription,
}: {
  inscription: IRpcObject<Inscription>;
}) => {
  return (
    <>
      {inscription
        ? `Ordinal [${inscription?.item.size.toLocaleString() ?? "-"} bytes]`
        : ""}
    </>
  );
};
