import { BorshCoder, IdlAccounts, Program } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";

import { useMemo } from "react";

import { useFetchSingleAccount } from "sdk";

import { LibreWallet } from "anchor/LibreWallet";
import { getProgramInstanceValidator } from "anchor/spl20_validator/getProgramInstanceValidatorProgram";
import { Spl20Validator } from "anchor/spl20_validator/spl20_validator";

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
        ? decodeValidator(program)(q?.data?.item.data, id)
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

// export const decodeLastValidations =
//   (program: Program<Spl20Validator>) =>
//   (buffer: Buffer | undefined, pubkey: PublicKey) => {
//     const coder = new BorshCoder(program.idl);
//     const inscription = buffer
//       ? coder.accounts.decode<LastValidations>("lastValidations", buffer)
//       : null;

//     return {
//       item: inscription,
//       pubkey,
//     };
//   };

// export const useLastValidations = (id: PublicKey | null, connection: Connection) => {
//   const q = useFetchSingleAccount(id, connection, false);

//   const wallet = useMemo(() => new LibreWallet(Keypair.generate()), []);

//   const program = useMemo(
//     () => getProgramInstanceValidator(connection, wallet),
//     [connection, wallet]
//   );

//   const decoded = useMemo(() => {
//     try {
//       const obj = q?.data?.item
//         ? decodeLastValidations(program)(q?.data?.item.buffer, id)
//         : null;
//       return obj;
//     } catch (e) {
//       console.log({ e });
//       return null;
//     }
//   }, [id, program, q?.data?.item]);

//   return {
//     data: decoded,
//     refetch: q.refetch,
//     isFetching: q.isFetching,
//   };
// };
