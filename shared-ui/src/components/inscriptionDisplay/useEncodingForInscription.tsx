import { IRpcObject } from "../executor";
import { EncodingType, Inscription } from "../../sdk";
import { mediaTypeToString } from "./useMediaType";

const encodingToString = (encodingType: EncodingType) => {
    return encodingType.base64 ? 'base64' : 'none'
}

export const useEncodingForInscription = (
  inscription: IRpcObject<Inscription | null>
) => {
  return inscription?.item?.encodingType
    ? encodingToString(inscription?.item?.encodingType)
    : "";
};
