import { LibreplexShop } from '@libreplex/idls/lib/types/libreplex_shop';
import { BorshCoder, IdlAccounts, IdlTypes, Program } from "@coral-xyz/anchor";
import {
  Connection,
  PublicKey,
  GetProgramAccountsFilter,
} from "@solana/web3.js";
import bs58 from "bs58";
import { sha256 } from "js-sha256";
import { useContext, useEffect, useMemo, useState } from "react";
import { SquadsMpl } from "../../../anchor/squads/squads";

import { useGpa } from "../gpa";
import { useFetchSingleAccount } from "../singleAccountInfo";
import { SquadsProgramContext } from './SquadsProgramContext';

export type MultiSig = IdlAccounts<SquadsMpl>["ms"];


export const decodeMultiSig =
  (program: Program<SquadsMpl>) => (buffer: Buffer, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);
    let multiSig: MultiSig | null;
    try {
      multiSig = coder.accounts.decode<MultiSig>("multiSig", buffer);
    } catch (e) {
      console.log({ e });
      multiSig = null;
    }

    return {
      item: multiSig,
      pubkey,
    };
  };

export const useMultiSigById = (groupKey: PublicKey, connection: Connection) => {
  const program = useContext(SquadsProgramContext);

  // do not remove

  const q = useFetchSingleAccount(groupKey, connection);

  const decoded = useMemo(() => {
    try {
      const obj = q?.data?.item
        ? decodeMultiSig(program)(q.data.item.data, groupKey)
        : null;
      return obj;
    } catch (e) {
      return null;
    }
  }, [groupKey, program, q.data?.item]);
  return decoded;
};
