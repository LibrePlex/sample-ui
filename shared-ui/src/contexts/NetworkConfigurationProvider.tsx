import React, { useCallback, useEffect, useMemo, useState } from "react"
import {useRouter} from "next/router";
import { useLocalStorage } from '@solana/wallet-adapter-react';
import { createContext, FC, ReactNode, useContext } from 'react';


export interface NetworkConfigurationState {
    networkConfiguration: string;
    setNetworkConfiguration(networkConfiguration: string): void;
}

export const NetworkConfigurationContext = createContext<NetworkConfigurationState>({} as NetworkConfigurationState);

export function useNetworkConfiguration(): NetworkConfigurationState {
    return useContext(NetworkConfigurationContext);
}

export const NetworkConfigurationProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const router = useRouter()
    
    const networkConfiguration = useMemo(()=>router.query.env as string ?? 'devnet',[router.query])

    const setNetworkConfiguration = useCallback((s: string) => {
        router.query.env = s
        router.push(router);
    },[router])

    return (
        <NetworkConfigurationContext.Provider value={{ networkConfiguration, setNetworkConfiguration }}>{children}</NetworkConfigurationContext.Provider>
    );
};