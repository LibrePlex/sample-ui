import { PublicKey } from '@solana/web3.js'
export * from './accounts'
export * from './instructions'
export * from './types'

/**
 * Program address
 *
 * @category constants
 * @category generated
 */
export const PROGRAM_ADDRESS = 'AJ5Hh5q4HegZWWu1ScY7ZRA6zELXmRzEWS5EXFSKqBC6'

/**
 * Program public key
 *
 * @category constants
 * @category generated
 */
export const PROGRAM_ID = new PublicKey(PROGRAM_ADDRESS)
