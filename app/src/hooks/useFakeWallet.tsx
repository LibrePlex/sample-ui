import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
export const useFakeWallet = () => {
  const router = useRouter();

  const wallet = useWallet();

  const [fakeWallet, setFakeWallet] = useState<PublicKey>();

  useEffect(() => {
    const { w } = router.query as { w: string };
    if (w) {
      try {
        setFakeWallet(old=>old?.toBase58() !== w ? new PublicKey(w) : old);
      } catch (e) {
        setFakeWallet(undefined);
      }
    }
  }, [router.query]);

  return { ...wallet, publicKey: fakeWallet ?? wallet.publicKey };
  
};
