import { getAttrValue } from "./getAttrValue";

import { Collection } from "./collection";
import { Metadata } from "./metadata";
import { IRpcObject } from "../../../components";

export interface IAttributeJson {
  trait_type: string;
  value: string | number;
}

export interface IFileJson {
  uri: string;
  type: string;
}

export interface ICreator {
  address: string;
  share: number;
}

export interface IMetadataJson {
  name: string;
  symbol: string;
  description?: string;
  seller_fee_basis_points?: number;
  image?: string;
  attributes: IAttributeJson[];
  properties: {
    files: IFileJson[];
    category?: string;
    creators: ICreator[];
  };
}

export const hydrateMetadataWithJson = (
  libreMetadataObj: Metadata,
  group: IRpcObject<Collection> | null,
  base64Image: string | null
) => {
  const signers = new Set(libreMetadataObj?.extensions?.find(item=>item.signers)?.signers?.signers ??[]);

  const royalties = libreMetadataObj?.extensions?.find(item=>item.royalties)?.royalties?.royalties;
  const retval: IMetadataJson = {
    name: libreMetadataObj.name,
    symbol: libreMetadataObj.symbol,
    description:
      libreMetadataObj?.asset?.image?.description ??
      libreMetadataObj?.asset?.inscription?.description ??
      undefined,
    seller_fee_basis_points:
      royalties?.bps ??
      (group?.item as any)?.royalties?.bps ??
      undefined,
    image: libreMetadataObj?.asset?.image?.url ?? base64Image ?? undefined,
    attributes:
    (group?.item as any)?.attributeTypes.map((item, idx) => ({
        trait_type: item.name,
        value: getAttrValue(item.permittedValues[idx]),
      })) ?? [],
    properties: {
      files: [
        ...(libreMetadataObj?.asset?.json
          ? [
              {
                uri: libreMetadataObj?.asset?.json.url,
                type: "application/json",
              },
            ]
          : []),
        ...(libreMetadataObj?.asset?.image
          ? [
              {
                uri: libreMetadataObj?.asset?.image.url,
                type: "image/png",
              },
            ]
          : []),
      ],
      creators:
      (group?.item as any)?.royalties?.shares?.map((item) => ({
          address: item.recipient.toBase58(),
          share: item.share / 100,
          verified: signers.has(item.recipient),
        })) ?? [],
    },
  };

  return retval;
};
