import { BorshCoder, IdlAccounts, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

import { LibreplexInscriptions } from "../../../anchor/libreplex_inscriptions";

export type InscriptionSummary =
  IdlAccounts<LibreplexInscriptions>["InscriptionSummary"];

export const decodeInscriptionSummary =
  (program: Program<LibreplexInscriptions>) =>
  (buffer: Buffer, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);
    try {
      const inscription = coder.accounts.decode<InscriptionSummary>(
        "InscriptionSummary",
        buffer
      );

      return {
        item: inscription ?? null,
        pubkey,
      };
    } catch (e) {
      return {
        item: null,
        pubkey,
      };
    }
  };
