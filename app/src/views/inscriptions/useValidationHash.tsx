import { calculateHashFromBuffer } from "@app/utils/calculateHashFromBuffer";
import { useMemo } from "react";

export const useValidationHash = (buf: Buffer | undefined) => {
  return useMemo(() => (buf ? calculateHashFromBuffer(buf) : undefined), [buf]);
};
