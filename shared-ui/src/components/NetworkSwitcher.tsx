import { FC } from 'react';
import dynamic from 'next/dynamic';
import React from 'react';
import { useNetworkConfiguration } from '../contexts';

export const NetworkSwitcher: FC = () => {
  const { networkConfiguration, setNetworkConfiguration } = useNetworkConfiguration();

  return (
    <label className="cursor-pointer label">
      <a>Network</a>
      <select             
        value={networkConfiguration}
        onChange={(e) => setNetworkConfiguration(e.target.value)} 
        className="select max-w-xs"
      >
        <option value="mainnet-beta">main</option>
        <option value="devnet">dev</option>
        <option value="testnet">test</option>
        <option value="local">local</option>
      </select>
    </label>
  );
};

export const NetworkSwitcherDynamic = dynamic(() => Promise.resolve(NetworkSwitcher), {
  ssr: false
})