import { IRpcObject } from "../executor";
import { EncodingType, Inscription } from "../../sdk";
import { mediaTypeToString } from "./useMediaType";

const encodingToString = (encodingType: EncodingType) => {
    return 'base64'
}

export const useEncodingForInscription = (
  inscription: IRpcObject<Inscription | null>
) => {
  return inscription?.item?.encodingType
    ? encodingToString(inscription?.item?.encodingType)
    : undefined;
};
