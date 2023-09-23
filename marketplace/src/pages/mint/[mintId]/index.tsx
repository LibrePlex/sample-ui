import { useRouter } from 'next/router'
import React from 'react'
import { MintDisplay } from "@libreplex/shared-ui"
import { PublicKey } from "@solana/web3.js"
import { Center } from '@chakra-ui/react'

type Props = {}

function MintDisplayPage({}: Props) {
    const router = useRouter()

    return (
        <Center m={12}>
            <MintDisplay mint={new PublicKey(router.query.mintId)}/>
        </Center>
    )
}

export default MintDisplayPage