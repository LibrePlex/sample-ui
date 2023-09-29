import React, { useMemo, useState } from 'react'
import { useCollectionById, useListingsByGroup } from '@libreplex/shared-ui'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/router'
import {PublicKey} from '@solana/web3.js'
import { Heading, VStack, Text, Skeleton, HStack } from '@chakra-ui/react'
import { MintCard } from '@marketplace/components/mintcard/MintCard'
import { ListingAction } from '@marketplace/components/gallery/listings/ListingAction'
import Link from 'next/link'

type Props = {}

function CollectionPage({}: Props) {
    const { connection } = useConnection()
    const { publicKey } = useWallet();
    const router = useRouter()
    const collectionKey = useMemo(()=>router.query.collectionId ? new PublicKey(router.query.collectionId) : null,[router.query.collectionId])
    const collection = useCollectionById(collectionKey, connection)
    const { data } = useListingsByGroup(collectionKey, connection)
    const [hasError, setHasError] = useState(false)


    return (
        <div
        style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent:'flex-start',
        margin: '92px 58px', gap: 64
        }}>
            
            <HStack gap={8} wrap="wrap">

                {
                    collection?.item.url.length && !hasError ? 
                    <img
                        src={collection.item.url}
                        style={{ minWidth: 116, maxWidth: 116, aspectRatio: "1/1", borderRadius: 8 }}
                        onError={(e)=>{setHasError(true)}}
                        />
                    : !hasError ?
                    <Skeleton
                        style={{ minWidth: 116, maxWidth: 116, aspectRatio: "1/1", borderRadius: 8 }}
                        />
                    :
                    <div style={{minWidth: 116, maxWidth: 116, aspectRatio: "1/1", borderRadius: 8, background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))'}}></div>
                }  


                <VStack align="start">
                    
                    {
                        collection ?
                        <Heading 
                        size={'4xl'}
                        className="gradientText"
                        style={{opacity: 0.7}}
                        >
                            {collection.item.name}
                        </Heading>
                        :
                        <Skeleton height="72px" w='200px'>
                            <Heading size="4xl"></Heading>
                        </Skeleton>
                    }
                    
                    <VStack align="start"  gap={0}>
                        <Text style={{fontSize: 12}} color="gray.400">Total: {data.length}</Text>
                        <Link href={`/user/${collection?.item.creator.toBase58()}`}>
                            <Text style={{fontSize: 12}} color="gray.400">Created by: {collection?.item.creator.toBase58().slice(0,4)}...{collection?.item.creator.toBase58().slice(collection?.item.creator.toBase58().length-4)}</Text>
                        </Link>
                    </VStack>
                </VStack>

            </HStack>

            <HStack wrap={"wrap"}>
            {data.map((listing, idx) => (
                <MintCard
                sx={{ position: "relative" }}
                key={idx}
                mint={listing.item.mint}
                >
                {publicKey && <ListingAction
                    publicKey={publicKey}
                    listing={{ ...listing, item: listing.item }}
                />}
                </MintCard>
            ))}
            </HStack>

        </div>
    )
}

export default CollectionPage