import { useRouter } from 'next/router'
import React from 'react'
import { MintDisplay } from "@libreplex/shared-ui"
import { PublicKey } from "@solana/web3.js"
import { Center, Text } from '@chakra-ui/react'
import Head from 'next/head'

type Props = {}

function MintDisplayPage({}: Props) {
    const router = useRouter()

    return (
        <>
        <Head>
            <title>LibrePlex - Mint {router.query.mintId}</title>
        </Head>
        <Center m={12}>
            {router.query.mintId ? <MintDisplay mint={new PublicKey(router.query.mintId)}/> : <Text>
                No mint id specified
            </Text>}
        </Center>
        </>
    )
}

export default MintDisplayPage