import { useEffect, useState } from "react";


import { useConnection } from "@solana/wallet-adapter-react";
import { IFairLaunchDeploymentIndexed } from "@app/pages/api/fairlaunch";
import { HttpClient } from "@libreplex/shared-ui";

export const useFairLaunchDeployments = (ticker: string | undefined) => {
  const [deployments, setDeployments] = useState<
    IFairLaunchDeploymentIndexed[]
  >([]);
  const [processing, setProcessing] = useState<boolean>(false);

  const [deploymentCount, setDeploymentCount] = useState<number>();

  const { connection } = useConnection();
  useEffect(() => {
    let active = true;
    (async () => {
      setProcessing(true);
      const httpClient = new HttpClient("/api");

      const { data, error } = await httpClient.post<
        IFairLaunchDeploymentIndexed[]
      >("/fairlaunch", {
        ticker,
      });

      if (data) {
        active && setDeploymentCount(data.length);

        active && setDeployments(data);
      } else {
        active && setDeploymentCount(0);

        active && setDeployments([]);
      }
      setProcessing(false);
    })();

    return () => {
      active = false;
    };
  }, [ticker]);

  return { deployments, processing, deploymentCount };
};
