import { useMemo } from "react";

export const getRentFromDataLength = (dataLength: number) => {
  return 0.00089088 + 0.00000696 * dataLength;
};
export const useRentForDataLength = (dataLength: number) => {
  return useMemo(
    () =>
      (Math.round(getRentFromDataLength(dataLength) * 100) / 100).toFixed(2),
    [dataLength]
  );
};
