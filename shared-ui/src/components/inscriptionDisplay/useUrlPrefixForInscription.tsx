import { IRpcObject } from "../executor";
import { Inscription } from "../../sdk";
import { mediaTypeToString } from "./useMediaType";

export const useUrlPrefixForInscription = (
  inscription: IRpcObject<Inscription | null>
) => {


  return inscription?.item?.mediaType ? mediaTypeToString(inscription?.item?.mediaType) : '';

};
