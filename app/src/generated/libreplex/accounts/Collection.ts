/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beet from '@metaplex-foundation/beet'
import * as beetSolana from '@metaplex-foundation/beet-solana'
import {
  NftCollectionData,
  nftCollectionDataBeet,
} from '../types/NftCollectionData'

/**
 * Arguments used to create {@link Collection}
 * @category Accounts
 * @category generated
 */
export type CollectionArgs = {
  seed: web3.PublicKey
  creator: web3.PublicKey
  name: string
  symbol: string
  url: string
  itemCount: beet.bignum
  nftCollectionData: beet.COption<NftCollectionData>
}

export const collectionDiscriminator = [48, 160, 232, 205, 191, 207, 26, 141]
/**
 * Holds the data for the {@link Collection} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class Collection implements CollectionArgs {
  private constructor(
    readonly seed: web3.PublicKey,
    readonly creator: web3.PublicKey,
    readonly name: string,
    readonly symbol: string,
    readonly url: string,
    readonly itemCount: beet.bignum,
    readonly nftCollectionData: beet.COption<NftCollectionData>
  ) {}

  /**
   * Creates a {@link Collection} instance from the provided args.
   */
  static fromArgs(args: CollectionArgs) {
    return new Collection(
      args.seed,
      args.creator,
      args.name,
      args.symbol,
      args.url,
      args.itemCount,
      args.nftCollectionData
    )
  }

  /**
   * Deserializes the {@link Collection} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [Collection, number] {
    return Collection.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link Collection} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig
  ): Promise<Collection> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    )
    if (accountInfo == null) {
      throw new Error(`Unable to find Collection account at ${address}`)
    }
    return Collection.fromAccountInfo(accountInfo, 0)[0]
  }

  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(
    programId: web3.PublicKey = new web3.PublicKey(
      'AJ5Hh5q4HegZWWu1ScY7ZRA6zELXmRzEWS5EXFSKqBC6'
    )
  ) {
    return beetSolana.GpaBuilder.fromStruct(programId, collectionBeet)
  }

  /**
   * Deserializes the {@link Collection} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [Collection, number] {
    return collectionBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link Collection} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return collectionBeet.serialize({
      accountDiscriminator: collectionDiscriminator,
      ...this,
    })
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link Collection} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args: CollectionArgs) {
    const instance = Collection.fromArgs(args)
    return collectionBeet.toFixedFromValue({
      accountDiscriminator: collectionDiscriminator,
      ...instance,
    }).byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link Collection} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    args: CollectionArgs,
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      Collection.byteSize(args),
      commitment
    )
  }

  /**
   * Returns a readable version of {@link Collection} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      seed: this.seed.toBase58(),
      creator: this.creator.toBase58(),
      name: this.name,
      symbol: this.symbol,
      url: this.url,
      itemCount: (() => {
        const x = <{ toNumber: () => number }>this.itemCount
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber()
          } catch (_) {
            return x
          }
        }
        return x
      })(),
      nftCollectionData: this.nftCollectionData,
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const collectionBeet = new beet.FixableBeetStruct<
  Collection,
  CollectionArgs & {
    accountDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['seed', beetSolana.publicKey],
    ['creator', beetSolana.publicKey],
    ['name', beet.utf8String],
    ['symbol', beet.utf8String],
    ['url', beet.utf8String],
    ['itemCount', beet.u64],
    ['nftCollectionData', beet.coption(nftCollectionDataBeet)],
  ],
  Collection.fromArgs,
  'Collection'
)
