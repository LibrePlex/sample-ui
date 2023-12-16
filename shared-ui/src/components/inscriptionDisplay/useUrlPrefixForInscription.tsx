import { IRpcObject } from "../executor";
import { Inscription, InscriptionV3 } from "../../sdk";
import { mediaTypeToString } from "./useMediaType";

export const useUrlPrefixForInscription = (
  inscription: IRpcObject<InscriptionV3 | null>
) => {


  return inscription?.item?.contentType;

};
