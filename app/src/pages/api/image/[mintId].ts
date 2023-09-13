import { allowCors } from "@/api/middleware/allowCors";
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
import {
  HttpClient,
  PROGRAM_ID_METADATA,
  decodeGroup,
  decodeMetadata,
  getBase64FromDatabytes,
  getMetadataExtendedPda,
  getMetadataPda,
  getProgramInstanceInscriptions,
  getProgramInstanceMetadata,
} from "@libreplex/shared-ui";
import { decodeInscription } from "@libreplex/shared-ui";
import { getAttrValue } from "utils/getAttrValue";

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
  let inscription, base64Image;
  if (libreMetadataObj.asset.inscription) {
    const inscriptionAccount = await connection.getAccountInfo(
      libreMetadataObj.asset.inscription.accountId
    );
    if (inscriptionAccount) {
      const item = decodeInscription(libreInscriptionsProgram)(
        inscriptionAccount.data,
        libreMetadataObj.group
      );
      inscription = item;
      console.log({ dataType: libreMetadataObj.asset.inscription.dataType });
      console.log({ dataBytes: inscription.item.dataBytes });
      res.setHeader('Content-type', inscription.item.dataType);
      res.status(200).send(inscription.item.dataBytes);
      return
      // base64Image = getBase64FromDatabytes(
      //   Buffer.from(inscription.item.dataBytes),
      //   libreMetadataObj.asset.inscription.dataType
      // );
      // const base = Buffer.from(inscription.item.dataBytes).toString("base64");
      // console.log({base});
      // const dataType = base.split("/")[0];
      // const dataSubType = base.split("/")[1];
      // const data = base.split("/").slice(2).join("/");
      // console.log(`data:${dataType}/${dataSubType};base64,${data}==`);
      // base64Image =`data:${dataType}/${dataSubType};base64,${data}==`;
    }
  }

  return res.status(500).json({
    msg: 'Not an inscription'
  });
};

export default allowCors(OffchainMetadata);
