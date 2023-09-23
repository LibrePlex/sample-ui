import React, { useState } from "react";
import ListingGallery from "../../components/gallery/listings/Listings";
import { Button, HStack, Heading, IconButton } from "@chakra-ui/react";
import Head from "next/head";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { IRpcObject, useAllListings } from  "@libreplex/shared-ui";

type Props = {}

function ListingsPage({}: Props) {

  const { connection } = useConnection();
  const { data, refetch } = useAllListings(connection);
  const [isRefreshing, setIsRefreshing] = useState(false)

  return (
    <>
      <Head>
        <title>LibrePlex - Listings</title>
      </Head>

      <div
      style={{
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent:'flex-start',
      margin: '92px 58px'
      }}>
        

        <HStack justifyContent="center" alignItems="center" gap={4}>

          <Heading 
          size={'4xl'}
          className="gradientText"
          style={{opacity: 0.7}}
          >
            Listings
          </Heading>

          <IconButton
          size="sm"
          isDisabled={isRefreshing}
          variant='outline'
          aria-label="Refresh"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg"  width="14" height="14" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
            <path d="M20 4v5h-5" />
          </svg>
          }
          onClick={()=>{
            setIsRefreshing(true)
            refetch().then(_ => setIsRefreshing(false))
          }}
          />
        </HStack>
        

        <ListingGallery data={data} />

      </div>
    </>
  );
};

export default ListingsPage
