import { useConnection } from "@solana/wallet-adapter-react";
import {
  AccountMeta,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { sha256 } from "js-sha256";
import React, { useContext } from "react";
import { MetadataProgramContext } from "../../anchor";
import { useFunder, useRenderedResult } from "./useRenderedResult";

/*
    Dynamic Rendering: this AssetType renders a json output from a custom program that
    the metadata contains a pointer to. 

    The way to get the output is by simulating a transaction. However 
    
        THE TRANSACTION NEVER GETS EXECUTED.

    The transaction logic goes as follows:
        1) init a new account with sufficient space to store the dynamically renderer output
        2) write the dynamically rendered output into the new account in the following format 
            
            (serialized into JSON):

            {
                image: string,
                description?: string 
            }
        3) return the buffer of the generated account

    In order for the transaction to be viable (i.e. potentially executable), it needs a payer 
    that will have sufficient funds to cover the account creation rent. Hence, we pick the account
    that holds the most amount of SOL as of 27 sep 2023 and mark that as a payer (see below "mainnetWhaleWallet").

    We can pick an arbitrary payer wallet because the tx never gets executed and hence the payer
    wallet never actually needs to sign. 
    
*/

export async function render(
  connection: Connection,
  renderProgramId: PublicKey,
  mintToRender: PublicKey,
  metadata: PublicKey,
  group: PublicKey,
  funder: PublicKey
) {
  const ixDiscrim = Buffer.from(sha256.digest("global:canonical")).slice(0, 8);

  const outputAddress = Keypair.generate();

  const keys: AccountMeta[] = [
    {
      pubkey: metadata,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: mintToRender,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: group,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: PublicKey.findProgramAddressSync(
        [mintToRender.toBuffer()],
        renderProgramId
      )[0],
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: outputAddress.publicKey,
      isSigner: false,
      isWritable: true,
    },
  ];

  const ix = new TransactionInstruction({
    data: ixDiscrim,
    programId: renderProgramId,
    keys,
  });

  const space = 1000_000;

  const createIx = SystemProgram.createAccount({
    lamports: await connection.getMinimumBalanceForRentExemption(space),
    space,
    programId: renderProgramId,
    fromPubkey: funder,
    newAccountPubkey: outputAddress.publicKey,
  });

  let tx = new Transaction().add(createIx, ix);
  tx.feePayer = funder;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  const simResult = await connection.simulateTransaction(tx, undefined, [
    outputAddress.publicKey,
  ]);

  const data = simResult.value.accounts?.[0]?.data[0];

  console.log({ data });

  if (!data) {
    console.log(simResult);
    throw new Error("Missing simulation result");
  }

  const buffer = Buffer.from(data, "base64");

  if (buffer.length < 8) {
    throw new Error("Invalid render data");
  }

  const dataLength = Number(buffer.readBigUInt64LE(buffer.length - 8));

  if (buffer.length < 8 + dataLength) {
    throw new Error("Invalid render data");
  }

  return buffer.slice(0, dataLength).toString();
}

export const AssetDisplayChainRenderer = ({
  mint,
  chainRendererProgramId,
}: {
  mint: PublicKey;
  chainRendererProgramId: PublicKey;
}) => {
  const funder = useFunder();
  const { program } = useContext(MetadataProgramContext);
  const { connection } = useConnection();

  const { data: renderedResult } = useRenderedResult(
    mint,
    chainRendererProgramId,
    program.programId,
    connection,
    funder
  );

  return (
    <>
      <object
        style={{
          height: "100%",
          width: "100%",
          borderRadius: 8,
        }}
        data={renderedResult?.image}
      />
    </>
  );
};
