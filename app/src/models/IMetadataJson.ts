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
  description: string;
  seller_fee_basis_points: number;
  image: string;
  attributes: IAttributeJson[];
  properties: {
    files: IFileJson[];
    category: string;
    creators: ICreator[]
  };
}
