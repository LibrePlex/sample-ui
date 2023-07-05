import React from "react"
import { useListingsByLister } from "shared-ui"
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {Text} from "@chakra-ui/react";

export const Listings = () => {

    const {publicKey} = useWallet();

    const {connection} = useConnection();
    
    const {data: listings} = useListingsByLister(publicKey, connection)
    return <>
        <Text>Listings: {listings.length}</Text>
    </>
}