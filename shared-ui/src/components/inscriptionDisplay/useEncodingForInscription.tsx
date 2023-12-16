import { IRpcObject } from "../executor";
import { EncodingType, Inscription, InscriptionV3 } from "../../sdk";
import { mediaTypeToString } from "./useMediaType";

const encodingToString = (encodingType: EncodingType) => {
    return 'base64'
}

export const useEncodingForInscription = (
  inscription: IRpcObject<InscriptionV3 | null>
) => {
  return inscription?.item?.encoding;
};
