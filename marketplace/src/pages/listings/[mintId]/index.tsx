import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { MintDisplay, usePublicKeyOrNull } from "shared-ui";
const Home: NextPage = (props) => {
    
    const router = useRouter();

    const mintId = useMemo(()=>router.query.mintId,[router])
  

    const mintPublicKey = usePublicKeyOrNull(mintId as string);
    return (
    <div>
        {mintPublicKey && <MintDisplay mint={mintPublicKey}/>}
    </div>
  );
};

export default Home;
