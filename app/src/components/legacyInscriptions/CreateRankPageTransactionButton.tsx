import {
    GenericTransactionButton,
    GenericTransactionButtonProps,
    IExecutorParams,
    ITransactionTemplate,
    getInscriptionRankPda,
    getProgramInstanceInscriptions
} from "@libreplex/shared-ui";
import {
    Connection,
    PublicKey,
    SystemProgram,
    TransactionInstruction,
} from "@solana/web3.js";

import { NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID } from "@app/environmentvariables";
import { notify } from "@libreplex/shared-ui";
import { getProgramInstanceLegacyInscriptions } from "@libreplex/shared-ui/src/anchor/legacyInscriptions/getProgramInstanceFairLaunch";


export interface IInscribeLegacyMint {
  pageIndex: number;
}

export const createRankPage = async (
  { wallet, params }: IExecutorParams<IInscribeLegacyMint>,
  connection: Connection,
  cluster: string
): Promise<{
  data?: ITransactionTemplate[];
  error?: any;
}> => {
  const data: ITransactionTemplate[] = [];
  const legacyInscriptionsProgram = getProgramInstanceLegacyInscriptions(
    connection,
    wallet
  );

  const inscriptionsProgram = getProgramInstanceInscriptions(
    connection,
    wallet
  );

  if (!legacyInscriptionsProgram) {
    throw Error("IDL not ready");
  }

  const { pageIndex } = params;

  const blockhash = await connection.getLatestBlockhash();
  const page = getInscriptionRankPda(BigInt(pageIndex))[0];

  console.log("f");
  const ix = await inscriptionsProgram.methods
    .createInscriptionRankPage({
      pageIndex,
    })
    .accounts({
      payer: wallet.publicKey,
      page,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  const instructions: TransactionInstruction[] = [];

  instructions.push(ix);
  data.push({
    instructions,
    signers: [],
    signatures: [],
    description: "Create rank page",
    blockhash,
  });
  console.log({ data });

  return {
    data,
  };
};

export const CreateRankPageTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IInscribeLegacyMint>,
    "transactionGenerator"
  >
) => {
  return (
    <GenericTransactionButton<IInscribeLegacyMint>
      text={`Create rank page`}
      transactionGenerator={createRankPage}
      onError={(msg) => notify({ message: msg ?? "Unknown error" })}
      {...props}
    />
  );
};
