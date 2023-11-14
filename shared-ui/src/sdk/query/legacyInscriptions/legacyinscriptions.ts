
import { PublicKey } from "@solana/web3.js";
import { BorshCoder, IdlAccounts, Program, IdlTypes } from "@coral-xyz/anchor";

import { LibreplexLegacy } from "../../../anchor/legacyInscriptions/libreplex_legacy";


export type LegacyInscription = IdlAccounts<LibreplexLegacy>["legacyInscription"];

export const decodeLegacyInscription =
  (program: Program<LibreplexLegacy>) =>
  (buffer: Buffer, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);
    const inscriptionBase = coder.accounts.decode<LegacyInscription>(
      "legacyInscription",
      buffer
    );

    const dataBytes = [...buffer.subarray(76)];

    const inscription = {
      ...inscriptionBase,
      dataBytes,
    };

    return {
      item: inscription ?? null,
      pubkey,
    };
  };
