import { Collection } from "generated/libreplex";

export const decodeCollection = (buffer: Buffer) => {
  const obj = Collection.deserialize(buffer);
  if (obj) {
    return obj[0];
  } else {
    return null;
  }
};
