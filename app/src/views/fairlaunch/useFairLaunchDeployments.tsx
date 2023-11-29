import { useEffect, useState } from "react";
import {
  Deployment,
  IRpcObject,
  LibreWallet,
  PROGRAM_ID_FAIR_LAUNCH,
  decodeDeployment,
  getProgramInstanceFairLaunch,
} from "@libreplex/shared-ui";
import { Keypair, PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { sha256 } from "js-sha256";
import bs58 from "bs58";
export const useFairLaunchDeployments = () => {
  const [deployments, setDeployments] = useState<IRpcObject<Deployment>[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);

  const [deploymentCount, setDeploymentCount] = useState<number>();

  const { connection } = useConnection();
  useEffect(() => {
    let active = true;
    (async () => {
      setProcessing(true);
      const _deployments = await connection.getProgramAccounts(
        new PublicKey(PROGRAM_ID_FAIR_LAUNCH),
        {
          filters: [
            {
              memcmp: {
                offset: 0,
                bytes: bs58.encode(
                  sha256.array("account:Deployment").slice(0, 8)
                ),
              },
            },
          ],
        }
      );
      const w = new LibreWallet(Keypair.generate());
      const p = getProgramInstanceFairLaunch(connection, w);
      const decode = decodeDeployment(p);

      let _count = 0;
      const _f: IRpcObject<Deployment>[] = [];
      for (const val of _deployments.values()) {
        _count++;
        try {
          const dec = decode(val.account.data, val.pubkey);
          _f.push(dec);
        } catch (e) {
          console.log(e);
        }
      }

      active && setDeploymentCount(_count);

      active && setDeployments(_f);
      setProcessing(false);
    })();

    return () => {
      active = false;
    };
  }, [connection]);

  return { deployments, processing, deploymentCount };
};
