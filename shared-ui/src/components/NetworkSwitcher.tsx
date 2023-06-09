import { FC } from 'react';
import dynamic from 'next/dynamic';
import { useNetworkConfiguration } from 'shared-ui';
import React from 'react';

export const NetworkSwitcher: FC = () => {
  const { networkConfiguration, setNetworkConfiguration } = useNetworkConfiguration();

  console.log(networkConfiguration);

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