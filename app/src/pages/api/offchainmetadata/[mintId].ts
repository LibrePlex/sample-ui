import { allowCors } from "@app/api/middleware/allowCors";
import { DEVNET_URL, LOCALNET_URL, MAINNET_URL } from "@app/environmentvariables";
import { Wallet } from "@coral-xyz/anchor";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { IMetadataJson } from "@app/models/IMetadataJson";
import { NextApiHandler } from "next";
import {
  HttpClient,
  PROGRAM_ID_METADATA,
  decodeCollection,
  decodeMetadata,
  getBase64FromDatabytes,
  getMetadataExtendedPda,
  getMetadataPda,
  getProgramInstanceInscriptions,
  getProgramInstanceMetadata,
} from "@libreplex/shared-ui";
import { decodeInscription } from "@libreplex/shared-ui";
import { getAttrValue } from "@app/utils/getAttrValue";

const OffchainMetadata: NextApiHandler = async (req, res) => {
  const { mintId, cluster } = req.query;

  const libreMetadataPda = getMetadataPda(
    new PublicKey(PROGRAM_ID_METADATA),
    new PublicKey(mintId)
  );
  const libreMetadataExtendedPda = getMetadataExtendedPda(libreMetadataPda[0]);

  const connection = new Connection(
    cluster === "localnet"
      ? LOCALNET_URL
      : cluster === "mainnet-beta"
      ? MAINNET_URL
      : DEVNET_URL
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

  const libreInscriptionsProgram = getProgramInstanceInscriptions(
    connection,
    new Wallet(Keypair.generate())
  );

  console.dir(
    { d: [...libreMetadataAccount[0].data] },
    { maxArrayLength: null }
  );

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
  if (libreMetadataObj.collection) {
    const groupAccount = await connection.getAccountInfo(
      libreMetadataObj.collection
    );

    console.log({ groupAccount });

    if (groupAccount) {
      const item = decodeCollection(libreProgram)(
        groupAccount.data,
        libreMetadataObj.collection
      );
      group = item;
    }
  }
  // if we have an extended obj, grab the collection
  let inscription, base64Image;
  if (libreMetadataObj.asset.inscription) {
    const inscriptionAccount = await connection.getAccountInfo(
      libreMetadataObj.asset.inscription.accountId
    );
    if (inscriptionAccount) {
      const item = decodeInscription(libreInscriptionsProgram)(
        inscriptionAccount.data,
        libreMetadataObj.collection
      );
      inscription = item;
      console.log({ dataType: libreMetadataObj.asset.inscription.dataType });
      console.log({ dataBytes: inscription.item.dataBytes });
      base64Image = getBase64FromDatabytes(
        Buffer.from(inscription.item.dataBytes),
        libreMetadataObj.asset.inscription.dataType
      );
      // const base = Buffer.from(inscription.item.dataBytes).toString("base64");
      // console.log({base});
      // const dataType = base.split("/")[0];
      // const dataSubType = base.split("/")[1];
      // const data = base.split("/").slice(2).join("/");
      // console.log(`data:${dataType}/${dataSubType};base64,${data}==`);
      // base64Image =`data:${dataType}/${dataSubType};base64,${data}==`;
    }
  }

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

  const signerSet = new Set(libreMetadataObj?.extensions?.find(item=>item.signers).signers.signers ?? []);
  const imageUrl =
    base64Image ?? jsondata?.image ?? libreMetadataObj?.asset?.image?.url;
  const retval: IMetadataJson = {
    ...jsondata,
    name: libreMetadataObj.name ?? jsondata.name,
    symbol: libreMetadataObj.symbol ?? jsondata.symbol,
    description:
      libreMetadataObj?.asset?.image?.description ??
      libreMetadataObj?.asset?.inscription?.description ??
      jsondata.description,
    seller_fee_basis_points:
      libreMetadataObj?.extensions?.find(item=>item.royalties)?.royalties?.royalties.bps ??
      group?.item.royalties?.bps ??
      jsondata?.seller_fee_basis_points,
    image: imageUrl,
    attributes:
      group?.item.attributeTypes.map((item, idx) => ({
        trait_type: item.name,
        value: getAttrValue(item.permittedValues[idx]),
      })) ??
      jsondata?.attributes ??
      [],
    properties: {
      ...jsondata?.properties,
      category: "image",
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
                uri: imageUrl,
                type: "image/png",
              },
            ]
          : libreMetadataObj?.asset.inscription
          ? [
              {
                uri: imageUrl,
                type: libreMetadataObj?.asset.inscription.dataType,
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

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(retval);
};

export default allowCors(OffchainMetadata);
