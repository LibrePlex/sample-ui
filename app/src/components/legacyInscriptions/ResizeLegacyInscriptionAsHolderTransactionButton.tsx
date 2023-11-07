import {
  GenericTransactionButton,
  GenericTransactionButtonProps,
  HttpClient,
  IExecutorParams,
  IRpcObject,
  ITransactionTemplate,
  Inscription,
  PROGRAM_ID_INSCRIPTIONS,
  getInscriptionPda,
  getLegacyMetadataPda
} from "@libreplex/shared-ui";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction
} from "@solana/web3.js";

import { NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID } from "@app/environmentvariables";
import { notify } from "@libreplex/shared-ui";
import { getProgramInstanceLegacyInscriptions } from "shared-ui/src/anchor/legacyInscriptions/getProgramInstanceLegacyInscriptions";
import { ITransaction } from "../../transactions/ITransaction";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { convertToWebpAndHash } from "@app/utils/webp";
import { IWebHashAndBuffer } from "@app/pages/api/image/[mintId]/webp";
import { AccountLayout } from "@solana/spl-token";
import { getLegacyInscriptionPda } from "shared-ui/src/pdas/getLegacyInscriptionPda";

export interface IResizeLegacyInscription {
  mint: PublicKey;
  inscription: IRpcObject<Inscription>;
}

export const MAX_CHANGE = 8192;

export const resizeLegacyInscription = async (
  { wallet, params }: IExecutorParams<IResizeLegacyInscription>,
  connection: Connection,
  cluster: string
): Promise<{
  data?: ITransactionTemplate[];
  error?: any;
}> => {
  const data: ITransactionTemplate[] = [];

  const legacyInscriptionsProgram = getProgramInstanceLegacyInscriptions(
    new PublicKey(NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID),
    connection,
    wallet
  );

  

  if (!legacyInscriptionsProgram) {
    throw Error("IDL not ready");
  }

  // have to check the owner here - unfortunate as it's expensive
  const { mint, inscription} = params;

  const tokenAccounts = await connection.getTokenLargestAccounts(mint);


  const legacyMetadata = getLegacyMetadataPda(mint)[0]

  let owner: PublicKey;
  let tokenAccount: PublicKey;

  for( const ta of tokenAccounts.value) {
    if(BigInt(ta.amount)>BigInt(0)) {
      tokenAccount = ta.address
    }
  }

  if(!tokenAccount) {
    throw Error('Token account not found for mint')
  }

  const tokenAccountData = await connection.getAccountInfo(tokenAccount);

  
  const legacyInscription = getLegacyInscriptionPda(mint)[0];

  const tokenAccountObj = AccountLayout.decode(tokenAccountData.data);

  owner = tokenAccountObj.owner;

  const httpClient =new HttpClient("");

  const {data: {buf, hash}} = await httpClient.post<IWebHashAndBuffer>(`/api/image/${mint.toBase58()}/webp`,
  {
    cluster
  });
  
  const targetSize = buf.length;
  let sizeRemaining = targetSize - inscription.item.size;
  const instructions: TransactionInstruction[] = [];

  
  while (Math.abs(sizeRemaining) > 0) {
    
    const instruction = await legacyInscriptionsProgram.methods
      .resizeLegacyInscriptionAsHolder({
        change:
          sizeRemaining > 0
            ? Math.min(sizeRemaining, MAX_CHANGE)
            : -Math.max(sizeRemaining, -MAX_CHANGE),
        expectedStartSize: Math.abs(sizeRemaining),
        targetSize,
      })
      .accounts({
        authority: wallet.publicKey, // this needs to be either the holder or update auth
        payer: wallet.publicKey,
        owner,
        mint,
        legacyMetadata,
        inscription: inscription.pubkey,
        inscriptionData: inscription.item.inscriptionData,
        legacyInscription,
        tokenAccount,
        systemProgram: SystemProgram.programId,
        inscriptionsProgram: PROGRAM_ID_INSCRIPTIONS
      })
      .instruction();
    instructions.push(instruction);

    sizeRemaining =
      sizeRemaining > 0
        ? Math.max(0, sizeRemaining - MAX_CHANGE)
        : Math.min(0, sizeRemaining + MAX_CHANGE);
  }

  const blockhash = await connection.getLatestBlockhash();
  const retval: ITransaction = {
    partiallySignedTxs: [],
  };
  const remainingInstructions: TransactionInstruction[] = [...instructions];
  while (remainingInstructions.length > 0) {
    const instructionBatch = remainingInstructions.splice(0, 4);
    const transaction = new Transaction();
    transaction.feePayer = new PublicKey(wallet.publicKey);
    transaction.recentBlockhash = blockhash.blockhash;
    transaction.add(
      // ixRankPageCurrent, ixRankPageNext,
      ...instructionBatch
    );
    // confirms the validation hash
    // transaction.partialSign(legacySignerKeypair);
    retval.partiallySignedTxs.push({
      blockhash,
      buffer: [...transaction.serialize({ verifySignatures: false })],
      signatures: transaction.signatures
        .filter((signature) => signature.signature)
        .map((signature) => ({
          signature: [...signature.signature!],
          pubkey: signature.publicKey.toBase58(),
        })),
    });
  }

  for (const serializedTx of retval.partiallySignedTxs) {
    let instructions: TransactionInstruction[] = [];

    instructions.push(...Transaction.from(serializedTx.buffer).instructions);
    data.push({
      instructions,
      signers: [],
      signatures: serializedTx.signatures,
      description: "Resize legacy inscription",
      blockhash: serializedTx.blockhash,
    });
  }

  console.log({data});

  return {
    data,
  };
};

export const ResizeLegacyMetadataAsHolderTransactionButton = (
  props: Omit<
    GenericTransactionButtonProps<IResizeLegacyInscription>,
    "transactionGenerator"
  >
) => {
  return (
    <GenericTransactionButton<IResizeLegacyInscription>
      text={`Resize`}
      transactionGenerator={resizeLegacyInscription}
      onError={(msg) => notify({ message: msg ?? "Unknown error" })}
      {...props}
    />
  );
};
