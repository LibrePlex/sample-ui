import { getProgramInstance } from "anchor/getProgramInstance";
import { DEVNET_URL, LOCALNET_URL, MAINNET_URL } from "@/environmentvariables";
import { Wallet } from "@coral-xyz/anchor";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { NextApiHandler } from "next";
import { getMetadataPda } from "pdas/getMetadataPda";
import { decodeMetadata } from "query/metadata";
import { Group, decodeGroup } from "query/group";
import { IMetadataJson } from "models/IMetadataJson";
import { getAttrValue } from "components/demo/collections/editCollectionDialog/AttributeTypeRow";
import { HttpClient } from "HttpClient";
import { getMetadataExtendedPda } from "pdas/getMetadataExtendedPda";
import { decodeMetadataExtended } from "query/metadataExtended";

const OffchainMetadata: NextApiHandler = async (req, res) => {
  const { mintId, cluster } = req.query;

  const libreMetadataPda = getMetadataPda(new PublicKey(mintId));
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
  if (!libreMetadataAccount) {
    return res.status(404).json({
      msg: `Libre metadata object at address ${libreMetadataPda[0].toBase58()} [mintId: ${mintId}] not found.`,
    });
  }

  const libreProgram = getProgramInstance(
    connection,
    new Wallet(Keypair.generate())
  );

  const { item: libreMetadataObj } = decodeMetadata(libreProgram)(
    libreMetadataAccount[0].data,
    libreMetadataPda[0]
  );

  if (!libreMetadataObj) {
    return res.status(404).json({
      msg: `Could not deserialize libre metadata object at address ${libreMetadataPda[0].toBase58()} [mintId: ${mintId}].`,
    });
  }

  const { item: libreMetadataExtendedObj } = decodeMetadataExtended(
    libreProgram
  )(libreMetadataAccount[1].data, libreMetadataExtendedPda[0]);

  // if we have an extended obj, grab the collection

  let group;
  if (libreMetadataExtendedObj) {
    const groupAccount = await connection.getAccountInfo(
      libreMetadataExtendedObj.group
    );

    console.log({ groupAccount });

    if (groupAccount) {
      const item = decodeGroup(libreProgram)(
        groupAccount.data,
        libreMetadataExtendedObj.group
      );
      group = item;
    }
  }
  console.log({ group, royalties: group?.item.royalties });

  // get url

  const httpClient = new HttpClient("");

  const { data, error } = await httpClient.get<any>(libreMetadataObj.url);

  const signerSet = new Set(libreMetadataExtendedObj.signers);

  const retval: IMetadataJson = {
    ...data,
    name: libreMetadataObj.name,
    symbol: libreMetadataObj.symbol,
    description: libreMetadataObj.description ?? "-",
    seller_fee_basis_points:
      libreMetadataExtendedObj?.royalties?.bps ?? group.item.royalties?.bps,
    image: libreMetadataObj?.url,
    attributes:
      group?.item.attributeTypes.map((item, idx) => ({
        trait_type: item.name,
        value: getAttrValue(item.permittedValues[idx]),
      })) ?? [],
    properties: {
      files: [
        {
          uri: libreMetadataObj?.url,
          type: "image/png",
        },
      ],
      category: "image",
      creators: group?.item.royalties?.shares?.map((item) => ({
        address: item.recipient.toBase58(),
        share: item.share/100,
        verified: signerSet.has(item.recipient)
      })),
    },
  };

  return res.status(200).json(retval);
};

export default OffchainMetadata;
