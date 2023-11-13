import { AccountLayout } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import { MintWithTokenAccount } from "shared-ui/src";

export const useOwnerOfMint = (mint: PublicKey) => {
  const { connection } = useConnection();
  const fetcher = useCallback(async () => {
    try {
      const tokenAccounts = await connection.getTokenLargestAccounts(mint);

      let tokenAccount: PublicKey;

      for (const ta of tokenAccounts.value) {
        if (BigInt(ta.amount) > BigInt(0)) {
          tokenAccount = ta.address;
        }
      }

      if (!tokenAccount) {
        throw Error("Token account not found for mint");
      }

      const tokenAccountData = await connection.getAccountInfo(tokenAccount);

      const tokenAccountObj = AccountLayout.decode(tokenAccountData.data);

      return {
        mint: mint,
        tokenAccount: {
          item: tokenAccountObj,
          pubkey: tokenAccount,
        },
      };
    } catch (e) {
      return null;
    }
  }, [mint, connection]);

  const key = useMemo(() => `owner-of-${mint?.toBase58()}`, [mint]);

  const q = useQuery<MintWithTokenAccount | null>(key, fetcher, {
    refetchOnMount: false,
  });

  return q;
};
