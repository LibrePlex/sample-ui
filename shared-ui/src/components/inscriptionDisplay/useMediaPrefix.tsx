import { PublicKey } from "@solana/web3.js";
import {
  useInscriptionDataForRoot,
  useInscriptionV3ForRoot,
} from "../../sdk";
import { useUrlPrefixForInscription } from "./useUrlPrefixForInscription";
import { useEncodingForInscription } from "./useEncodingForInscription";
import { useMemo } from "react";

export const useMediaPrefix = (root: PublicKey) => {
  const { data: inscriptionData } = useInscriptionDataForRoot(root);
  const {inscription} = useInscriptionV3ForRoot(root);

  const {inscription: inscriptionV3} = useInscriptionV3ForRoot(root);
  const urlPrefix = useUrlPrefixForInscription(inscriptionV3?.data);

  const encoding = useEncodingForInscription(inscriptionV3?.data);

  const base64ImageInscription = useMemo(
    () => Buffer.from(inscriptionData?.item?.buffer ?? []).toString("base64"),
    [inscriptionData?.item?.buffer]
  );

  const asciiImageInscription = useMemo(
    () => Buffer.from(inscriptionData?.item?.buffer ?? []).toString("ascii"),
    [inscriptionData?.item?.buffer]
  );

  const prefixOverride = useMemo(
    () =>
      asciiImageInscription?.startsWith("<svg") ||
      asciiImageInscription.startsWith("<SVG")
        ? "image/svg+xml"
        : undefined,
    [asciiImageInscription]
  );

  const mediaType = useMemo(
    () =>
      (inscriptionV3?.data?.item?.contentType !== ""
        ? inscriptionV3?.data?.item?.contentType
        : undefined) ??
      prefixOverride ??
      urlPrefix ??
      "image/*",
    [inscriptionV3?.data?.item, prefixOverride, urlPrefix]
  );

  const isText = useMemo(
    () => mediaType.startsWith("text/") || mediaType === "application/text",
    [mediaType]
  );

  return {mediaType: prefixOverride ?? mediaType, isText, asciiImageInscription, base64ImageInscription, encoding}
};
