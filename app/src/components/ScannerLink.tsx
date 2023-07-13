import { PublicKey } from "@solana/web3.js";
import { HiMagnifyingGlassCircle } from "react-icons/hi2";
export const ScannerLink = ({ mintId }: { mintId: PublicKey }) => {
  return (
    <>
      <a href={`/scanner?mintId=${mintId.toBase58()}`} target="_blank">
        <HiMagnifyingGlassCircle />
      </a>
    </>
  );
};
