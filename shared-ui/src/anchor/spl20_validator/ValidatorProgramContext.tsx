import { Program } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { LibreWallet } from "anchor/LibreWallet";
import { Spl20Validator } from "anchor/spl20_validator/spl20_validator";
import { ReactNode, createContext, useEffect, useState } from "react";
import { getProgramInstanceValidator } from "./getProgramInstanceValidatorProgram";
import React from "react";

export const ValidatorProgramContext = createContext<Program<Spl20Validator>>(
  undefined!
);

export const ValidatorProgramProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const wallet = useWallet();

  const [program, setProgram] = useState<Program<Spl20Validator>>();

  const { connection } = useConnection();

  useEffect(() => {
    const program = getProgramInstanceValidator(
      connection,
      new LibreWallet(Keypair.generate())
    );

    setProgram(program);
  }, [wallet, connection]);

  return program?.programId ? (
    <ValidatorProgramContext.Provider value={program}>
      {children}
    </ValidatorProgramContext.Provider>
  ) : (
    <></>
  );
};
