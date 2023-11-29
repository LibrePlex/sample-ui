import { BorshCoder, IdlAccounts, Program } from "@coral-xyz/anchor";
import {
  IRpcObject,
    LibreWallet, useFetchSingleAccount
} from "@libreplex/shared-ui";
import { useConnection } from "@solana/wallet-adapter-react";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { getProgramInstanceValidator } from "shared-ui/src/anchor/spl20_validator/getProgramInstanceValidatorProgram";
import { Spl20Validator } from "shared-ui/src/anchor/spl20_validator/spl20_validator";
import { sha256 } from "js-sha256";
import bs58 from "bs58";
export const PROGRAM_ID_SPL20 = "SPLsCpfTUEZe43PDw9KXnw6eJfKVZoKYCGGPY29S3fN";

export type Validator = IdlAccounts<Spl20Validator>["validator"];
export type ValidationResult = IdlAccounts<Spl20Validator>["validationResult"];
export type Validations = IdlAccounts<Spl20Validator>["validations"];
// export type LastValidations = IdlAccounts<Spl20Validator>["lastValidations"];

export const getBase64FromDatabytes = (dataBytes: Buffer, dataType: string) => {
  console.log({ dataBytes });
  const base = dataBytes.toString("base64");
  return `data:${dataType};base64,${base}`;
};

export const decodeValidator =
  (program: Program<Spl20Validator>) =>
  (buffer: Buffer | undefined, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);
    const inscription = buffer
      ? coder.accounts.decode<Validator>("validator", buffer)
      : null;

    return {
      item: inscription,
      pubkey,
    };
  };

export const useValidator = (id: PublicKey | null, connection: Connection) => {
  const q = useFetchSingleAccount(id, connection);

  const wallet = useMemo(() => new LibreWallet(Keypair.generate()), []);

  const program = useMemo(
    () => getProgramInstanceValidator(connection, wallet),
    [connection, wallet]
  );

  const decoded = useMemo(() => {
    try {
      const obj = q?.data?.item
        ? decodeValidator(program)(q?.data?.item.buffer, id)
        : null;
      return obj;
    } catch (e) {
      console.log({ e });
      return null;
    }
  }, [id, program, q?.data?.item]);

  return {
    data: decoded,
    refetch: q.refetch,
    isFetching: q.isFetching,
  };
};


export const useLegacyValidators = () => {
  const [validators, setValidators] = useState<IRpcObject<Validator>[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);

  const [deploymentCount, setDeploymentCount] = useState<number>();

  const { connection } = useConnection();
  useEffect(() => {
    let active = true;
    (async () => {
      setProcessing(true);
      const _deployments = await connection.getProgramAccounts(
        new PublicKey(PROGRAM_ID_SPL20),
        {
          filters: [
            {
              memcmp: {
                offset: 0,
                bytes: bs58.encode(
                  sha256.array("account:Validator").slice(0, 8)
                ),
              },
            },
          ],
        }
      );
      const w = new LibreWallet(Keypair.generate());
      const p = getProgramInstanceValidator(connection, w);
      const decode = decodeValidator(p);

      let _count = 0;
      const _f: IRpcObject<Validator>[] = [];
      for (const val of _deployments.values()) {
        _count++;
        try {
          const dec = decode(val.account.data, val.pubkey);
          _f.push(dec);
        } catch (e) {
          console.log(e);
        }
      }

      active && setDeploymentCount(_count);

      active && setValidators(_f);
      setProcessing(false);
    })();

    return () => {
      active = false;
    };
  }, [connection]);

  return { validators, processing, deploymentCount };
}