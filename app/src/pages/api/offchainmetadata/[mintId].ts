
import { DEVNET_URL, LOCALNET_URL, MAINNET_URL } from "@/environmentvariables";
import { Wallet } from "@coral-xyz/anchor";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { IMetadataJson } from "models/IMetadataJson";
import { NextApiHandler } from "next";
import { HttpClient, PROGRAM_ID_METADATA, decodeGroup, decodeMetadata, getMetadataExtendedPda, getMetadataPda, getProgramInstanceMetadata } from "shared-ui";
import { getAttrValue } from "utils/getAttrValue";

const OffchainMetadata: NextApiHandler = async (req, res) => {
  const { mintId, cluster } = req.query;

  const libreMetadataPda = getMetadataPda(new PublicKey(PROGRAM_ID_METADATA), new PublicKey(mintId));
  const libreMetadataExtendedPda = getMetadataExtendedPda(libreMetadataPda[0]);

  const connection = new Connection(
    cluster === "localnet"
      ? LOCALNET_URL
      : cluster === "devnet"
      ? DEVNET_URL
      : MAINNET_URL
  );

  const libreMetadataAccount = await connection.getMultipleAccountsInfo([
    libreMetadataPda[0],
    libreMetadataExtendedPda[0],
  ]);
  if (!libreMetadataAccount[0]) {
    return res.status(404).json({
      msg: `Libre metadata object at address ${libreMetadataPda[0].toBase58()} [mintId: ${mintId}] not found.`,
    });
  }

  const libreProgram = getProgramInstanceMetadata(
    new PublicKey(PROGRAM_ID_METADATA),
    connection,
    new Wallet(Keypair.generate())
  );

  console.dir({d: [...libreMetadataAccount[0].data]}, {'maxArrayLength': null});

  const { item: libreMetadataObj } = decodeMetadata(libreProgram)(
    libreMetadataAccount[0].data,
    libreMetadataPda[0]
  );

  console.log({ libreMetadataObj });

  if (!libreMetadataObj) {
    return res.status(404).json({
      msg: `Could not deserialize libre metadata object at address ${libreMetadataPda[0].toBase58()} [mintId: ${mintId}].`,
    });
  }
  let group;
  if (libreMetadataObj.group) {
    const groupAccount = await connection.getAccountInfo(
      libreMetadataObj.group
    );

    console.log({ groupAccount });

    if (groupAccount) {
      const item = decodeGroup(libreProgram)(
        groupAccount.data,
        libreMetadataObj.group
      );
      group = item;
    }
  }
  // if we have an extended obj, grab the collection

  console.log({ group, royalties: group?.item.royalties });

  // get url

  const httpClient = new HttpClient("");

  let jsondata;
  if (libreMetadataObj.asset.json) {
    const { data, error } = await httpClient.get<any>(
      libreMetadataObj.asset.json.url
    );
    jsondata = data;
  }

  const signerSet = new Set(libreMetadataObj?.extension?.nft?.signers ?? []);

  const retval: IMetadataJson = {
    ...jsondata,
    name: libreMetadataObj.name ?? jsondata.name,
    symbol: libreMetadataObj.symbol ?? jsondata.symbol,
    description: libreMetadataObj.description ?? jsondata.description,
    seller_fee_basis_points:
      libreMetadataObj?.extension?.nft?.royalties?.bps ??
      group?.item.royalties?.bps ??
      jsondata.seller_fee_basis_points,
    image: libreMetadataObj?.asset?.image?.url ?? jsondata.image,
    attributes:
      group?.item.attributeTypes.map((item, idx) => ({
        trait_type: item.name,
        value: getAttrValue(item.permittedValues[idx]),
      })) ??
      jsondata?.attributes ??
      [],
    properties: {
      ...jsondata?.properties,
      files: [
        ...(libreMetadataObj?.asset?.json
          ? [
              {
                uri: libreMetadataObj?.asset?.json,
                type: "application/json",
              },
            ]
          : []),
        ...(libreMetadataObj?.asset?.image
          ? [
              {
                uri: libreMetadataObj?.asset?.json,
                type: "image/png",
              },
            ]
          : []),
      ],
      creators:
        group?.item.royalties?.shares?.map((item) => ({
          address: item.recipient.toBase58(),
          share: item.share / 100,
          verified: signerSet.has(item.recipient),
        })) ?? jsondata?.properties.creators,
    },
  };

  return res.status(200).json(retval);
};

export default OffchainMetadata;
