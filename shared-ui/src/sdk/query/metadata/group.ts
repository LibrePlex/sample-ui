import { BorshCoder, IdlAccounts, Program, IdlTypes } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { MetadataProgramContext } from "../../../anchor/metadata/MetadataProgramContext";
import bs58 from "bs58";
import { sha256 } from "js-sha256";
import { useContext, useEffect, useMemo } from "react";
import BN from "bn.js";
import { useGpa } from "../gpa";
import { useFetchSingleAccount } from "../singleAccountInfo";
import { LibreplexMetadata } from "@libreplex/idls/lib/types/libreplex_metadata";
// import { Royalties } from "./metadata";
import { IDL } from "@libreplex/idls/lib/cjs/libreplex_metadata";
import { BitKeepWalletAdapter } from "@solana/wallet-adapter-wallets";

export type Group = IdlAccounts<LibreplexMetadata>["group"];

export type GroupInput = IdlTypes<LibreplexMetadata>["GroupInput"];

export type PermittedSigners = IdlTypes<LibreplexMetadata>["Royalties"];

export type AttributeValue = any; //IdlTypes<LibreplexMetadata>["AttributeValue"];

export type RoyaltyShare = IdlTypes<LibreplexMetadata>["RoyaltyShare"];

export interface AttributeType {
  name: string;
  permittedValues: AttributeValue[];
  deleted: boolean;
  continuedAtIndex: number;
  continuedFromIndex: number;
}

// const coder = new BorshCoder(program.idl);
const coder = new BorshCoder(IDL);

const blacklistedPubkeys = new Set<string>([
  "C1RM7YH3FUNP9ZaWSgRhWjkfeVscze6dwj9E8vuxnnnv",
  "MfrWwgbaekZHpYbBG1W7cXqih8pUUc5n6ssKFueeSjv",
  "3TpzCbWPWcwQiYcjHAtDWS8oEzUToviyLaApjGcvQPS5",
  "4htouAYFpWQPFR88HCHiyA3kcvnhksT47PqjjpvSU1Ti",
  "TfADc7m8SaQWWFKJHP9PzcrRomzMsLuqobs13GYAa3q",
  "2SgHzCVTaHnQnN9q3KEFN9PbrtTnPDmiLezchadL3duv",
  "HxU1KxQeCZ1JNahK1d4AtYDjqEeC4WzH5S4F5xgaBBTg",
  "3VyhLa9LXB12HSDVaRrkghJLK11Qizvg1BskWvPkZ9FX",
  "2A5iDnxuFXQdVDxPqVKHAN7xy6yakyXhs3PecuoEjoY2",
  "FMbfrtYszeHTgGtw2UW6ccNN4LCMps67bCUe2DqFk5h3",
  "4Edo9dn6EXp68PyV18SYkU539rg4kYxECSkj8v9WCMHu",
  "9RzdxEHSxSoik7goTgdYb3bgkxB2nV6pSkNYYGgT1BaT",
  "CU8zKmLAUDc7GukdcExwhihQGVVZ7J6eRyVYqS2psPC3",
  "DHrY7FZiErsFXtTL4JXXaBu6HjjaxGY3yxbYgNFFAkcc",
  "9S9ibsgMfPgqdcDaDuW4UEhYq8brNgt4bTjbmeMwRLcQ",
  "2gY3RQGXSJ1ViM2p5jDKJSPmaZZNcdZW9cLgS4CQ2nAg",
  "E8eHq35xP2DdLiY1EzAoNQzMbA7fpCWeNkgAxs4yPjd3",
  "4pvyt6xax7RHvoHpbZmtU1yQjSM6sazyrumkQzMqi8Zy",
  "3PKoDRvajNxSh25LKuCtGHki1LKhaAJgBNt9By9FgtW8",
  "8UdL64wUjND5SG6frvN4Cgdta7ncJ3yt6D2T9ev6YMFF",
  "nxvK1d3Uw3PT3Gnt7gGyawWu7qNHxbKMN7ZFwaHpTsP",
  "AeKjcZK7DRbCfNYELtE2pJKkc2Yj5vX98NEqmvAyXxST",
  "3W2FtD1LxaupWnMLHBXJmNzMpub5v26dkm1YXNeEntW2",
  "SjRYerPavZTrA5gRHjQMg3oVBn7NuKYjziPGN6cA5tT",
  "Hbi79YyUw6FkWS6PvJKQ25MLxbpdCaoq7JB5yA4pJBEm",
  "Gb3YP2bPAoKoS9waSE1XYAdPGdviuGfpJK3KkL9P6hKp",
  "GvMP6YE89xA2gm84JNQo2cBM68tDZ7isCn8QFr7EgTX9",
  "CGK1zvy8xpBCNEzNk1RfhYpRmsH7dbNzw2DsuCiECUTH",
  "9Uvh29nYFK5Z8MfftWC42hiXBqN45PFV2Zg7J9FE6e4x",
  "83Np4BxizdR6czUuX7rbbYirT1cCSbeytN1m4Fmke9TK",
  "GB6kvrVh6BzvHrWvV9EDr9DqzUT5quJjzhcJc1ieuEBT",
  "7abM73krmfQo5k4GAaMzM5jFT8g8DQHxHnGGSAtvdWWD",
  "DU3Jr4QHvVux65ZBDFfLtZyk9nfJbueMgHUJzVDPBC9H",
  "AUA8ngfiHRjwYvfgVuuPqQ2fi7aqWkuJPfz94MS2Khsg",
  "CgUudCeH7iwJSZNER2XiaHcxQpoyLdTsEGpu6ZMp2mog",
  "BUdpC4oNBLQFK4owZd9ucyU1J1nbbXvSmeMsYvptq93k",
  "BhWsQRXJVDg1n6QECEys6GoBgqnh5qsENCcBxLcdRsQV",
  "GPWN2ky7X6dSPbG5zxDqhHu5wbjuiiePxjTVDzT3G5R3",
  "B87UnMLC9SqsCYXHrWrzernUrZHmMGRkeE4KiPvCgxMX",
  "XfNTsZyfHJNxJuNXsw4tKaf8XNdNFhxYd4diHXU1fbP",
  "8oBqwE2KPsoYjaej7NUBF8B9DxKrtpnk1wjY5Rgz1uFG",
  "13jPmPhoZ3PL6sEHYdphkJi3R26vwgZDNJkVGCy7Lt9P",
  "8Z1HGdiXtEaTvwipbk8Ccnf1dwwzSJ6PeEejw9qop9eC",
  "3R8ZgxwBDuz9zA5TThMmEABWAWvQkimPMdqp3aBFqsho",
  "Ftun8ThqJPhWLx4Z6MpYEnKC1tZUsN9GEtskZqkta3Sm",
  "BqW7qd6vmpcBKVARNykeuaW5FF6LU7ZymnZqE4AYAMP5",
  "6XWhqVa2oWYtXmQHCbS8QpBcQGKHfbTYYBQs8pS3GNat",
  "95mA82ASL2unDCc4hPENRc2WgvoBcWCi1JvRifq3BShD",
  "2ktvduajqBVxMELKBKRey6cnGKdEpuhymeSoFgCCG2rH",
  "6M2MNyqDnBETGfyCfKRSvQFPeWeaX2CzZxiyfiRbYFAS",
  "EkBQqjiYed1oroGbXnjDt7G8g1bRhAwUrVuxxqDH6mE9",
  "A15D72wGv7TFvuwiK7P4FaXJMP1t4aQyVCyjrhMxS9pe",
  "6xYTUGFDZpFvbPhKLaQUtMwjfwtuMTzxgsjdvfQwq8Yd",
  "CfVer3mgnfF8GGT9qk4y45FxMGh3u8TbMy6uZoSjHcjD",
  "8bKjP1fw7tY6CSXnb5iFbMJcHvf8PYsz8kwzyNVVSxGq",
  "8ap24kEqwCsehRdvjEF32A1fF7yUU6TTJUu94WC1sPGB",
]);
export const decodeGroup =
  (program: Program<LibreplexMetadata>) =>
  (
    buffer: Buffer,
    pubkey: PublicKey
  ): {
    item: Group | null;
    pubkey: PublicKey;
  } => {
    let group: Group | null = null;
    console.log(pubkey.toBase58());
    if (!blacklistedPubkeys.has(pubkey.toBase58())) {
      try {
        console.log({ buffer });
        group = coder.accounts.decode<Group>("group", buffer);
      } catch (e) {
        console.log({ e });
      }
    }

    console.log({ group });
    return {
      item: group,
      pubkey,
    };
  };

export const useGroupById = (
  groupKey: PublicKey | null,
  connection: Connection
) => {
  const { program } = useContext(MetadataProgramContext);

  // do not remove

  const q = useFetchSingleAccount(groupKey, connection);

  const decoder = useMemo(() => decodeGroup(program), [program]);

  const decoded = useMemo(() => {
    console.log("decoding", { groupKey, decoder, q });
    try {
      const obj =
        groupKey && q?.data?.item
          ? decoder(q.data.item.buffer, groupKey)
          : null;
      return obj;
    } catch (e) {
      return null;
    }
  }, [groupKey, decoder, q.data?.item]);
  return decoded;
};

export const useGroupsByAuthority = (
  authority: PublicKey | null,
  connection: Connection
) => {
  const { program } = useContext(MetadataProgramContext);

  const filters = useMemo(() => {
    if (authority) {
      const filters = [
        {
          memcmp: {
            offset: 40,
            bytes: authority.toBase58(),
          },
        },
        {
          memcmp: {
            offset: 0,
            bytes: bs58.encode(sha256.array("account:Group").slice(0, 8)),
          },
        },
      ];
      return filters;
    } else {
      return undefined;
    }
  }, [authority]);

  const q = useGpa(program.programId, filters, connection, [
    authority?.toBase58() ?? "",
    "groupsByAuthority",
  ]);

  const decoder = useMemo(() => decodeGroup(program), [decodeGroup, program]);
  const decoded = useMemo(
    () => ({
      ...q,
      data: q?.data?.map((item) => decoder(item.item, item.pubkey)) ?? [],
    }),

    [decoder, q.data]
  );

  return decoded;
};
