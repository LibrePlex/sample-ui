import React, { useCallback, useEffect, useMemo, useState } from "react"
import {useRouter} from "next/router";
import { useLocalStorage } from '@solana/wallet-adapter-react';
import { createContext, FC, ReactNode, useContext } from 'react';


export interface ClusterState {
    cluster: string;
    setCluster(cluster: string): void;
}

export const ClusterContext = createContext<ClusterState>({} as ClusterState);

export function useCluster(): ClusterState {
    return useContext(ClusterContext);
}

export const NetworkConfigurationProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const router = useRouter()
    
    const networkConfiguration = useMemo(()=>router.query.env as string ?? 'mainnet-beta',[router.query])

    const setNetworkConfiguration = useCallback((s: string) => {
        router.query.env = s
        router.push(router);
    },[router])

    return (
        <ClusterContext.Provider value={{ cluster: networkConfiguration, setCluster: setNetworkConfiguration }}>{children}</ClusterContext.Provider>
    );
};