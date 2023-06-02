export * from './Collection'
export * from './CollectionPermissions'
export * from './Metadata'
export * from './MetadataPermissions'
export * from './NftMetadataUnique'

import { Collection } from './Collection'
import { Metadata } from './Metadata'
import { NftMetadataUnique } from './NftMetadataUnique'
import { MetadataPermissions } from './MetadataPermissions'
import { CollectionPermissions } from './CollectionPermissions'

export const accountProviders = {
  Collection,
  Metadata,
  NftMetadataUnique,
  MetadataPermissions,
  CollectionPermissions,
}
