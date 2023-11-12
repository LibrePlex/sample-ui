import { FC } from 'react';
import dynamic from 'next/dynamic';
import React from 'react';
import { useCluster } from '../contexts';

export const NetworkSwitcher: FC = () => {
  const { cluster, setCluster } = useCluster();

  return (
    <label className="cursor-pointer label">
      <a>Network</a>
      <select             
        value={cluster}
        onChange={(e) => setCluster(e.target.value)} 
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