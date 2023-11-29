import { useFetchSingleAccount } from '@libreplex/shared-ui';
import { FairLaunchProgramContext } from './FairLaunchProgramContext';
import { IdlAccounts, IdlTypes } from "@coral-xyz/anchor";
import { BorshCoder, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";

import { useContext, useEffect, useMemo } from "react";
import { LibreplexFairLaunch } from "./libreplex_fair_launch";



export type Deployment = IdlAccounts<LibreplexFairLaunch>["deployment"];
export type Hashlist = IdlAccounts<LibreplexFairLaunch>["hashlist"];

export const getBase64FromDatabytes = (dataBytes: Buffer, dataType: string) => {
  console.log({ dataBytes });
  const base = dataBytes.toString("base64");
  return `data:${dataType};base64,${base}`;
};

export const decodeDeployment =
  (program: Program<LibreplexFairLaunch>) =>
  (buffer: Buffer | undefined, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);
    const inscription = buffer
      ? coder.accounts.decode<Deployment>("deployment", buffer)
      : null;

    return {
      item: inscription,
      pubkey,
    };
  };

export const useDeploymentById = (
  deploymentId: PublicKey | null,
  connection: Connection,
  refetchInterval?: number
) => {
  const {program} = useContext(FairLaunchProgramContext);
  
  const q = useFetchSingleAccount(deploymentId, connection, refetchInterval);

  const decoded = useMemo(() => {
    try {
      const obj = q?.data?.item && deploymentId
        ? decodeDeployment(program)(q?.data?.item.buffer, deploymentId)
        : undefined;
      return obj;
    } catch (e) {
      return null;
    }
  }, [deploymentId, program, q.data?.item?.buffer.length]);

  return {
    data: decoded,
    refetch: q.refetch,
    isFetching: q.isFetching,
  };
};


export const decodeHashlist =
  (program: Program<LibreplexFairLaunch>) =>
  (buffer: Buffer | undefined, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);
    const inscription = buffer
      ? coder.accounts.decode<Hashlist>("hashlist", buffer)
      : null;

    return {
      item: inscription,
      pubkey,
    };
  };

export const useHashlistById = (
  hashlistId: PublicKey | null,
  connection: Connection,
  refetchInterval?: number
) => {
  const {program} = useContext(FairLaunchProgramContext);
  
  const q = useFetchSingleAccount(hashlistId, connection, refetchInterval);

  const decoded = useMemo(() => {
    try {
      const obj = q?.data?.item && hashlistId
        ? decodeHashlist(program)(q?.data?.item.buffer, hashlistId)
        : undefined;
      return obj;
    } catch (e) {
      return null;
    }
  }, [hashlistId, program, q.data?.item?.buffer.length]);

  return {
    data: decoded,
    refetch: q.refetch,
    isFetching: q.isFetching,
  };
};
