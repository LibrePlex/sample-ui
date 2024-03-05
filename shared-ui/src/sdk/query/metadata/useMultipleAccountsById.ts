import { useQuery } from "react-query";
import { Connection, PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IRpcObject } from "../../../components";
import { BufferingConnection } from "../../../stores";
import { sha256 } from "js-sha256";
import bs58 from "bs58";

enum Status {
  Ready,
  Loading,
  Loaded,
}

const calculateHash = (ids: PublicKey[]) => {
  let currentHash = "";
  for (const id of ids) {
    currentHash = bs58.encode(
      sha256.array(`${currentHash}${id.toBase58()}`).slice(0, 8)
    );
  }
  return currentHash;
};
