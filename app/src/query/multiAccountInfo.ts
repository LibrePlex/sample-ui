import {
  Connection,
  PublicKey
} from "@solana/web3.js";
import { IRpcObject } from "components/executor/IRpcObject";

export const fetchMultiAccounts =
  <T extends unknown>(
    accountKeys: PublicKey[],
    decoder: (b: Buffer, publicKey: PublicKey) => T,
    connection: Connection
  ) =>
  async () => {
    const _items: IRpcObject<T>[] = [];
    const remainingAccountKeys = [...accountKeys];

    while (remainingAccountKeys.length > 0) {
      /// 100 is the max for getMultipleAccountsInfo
      const batchKeys = remainingAccountKeys.splice(0, 100);

      const results = await connection.getMultipleAccountsInfo(batchKeys);

      for (const [idx, result] of results.entries()) {
        if (result?.data) {
          const obj = decoder(result.data, accountKeys[idx]);
          if (obj) {
            _items.push({
              pubkey: batchKeys[idx],
              item: obj,
            });
          }
        }
      }
    }
    console.log({ _items });
    return _items;
  };
