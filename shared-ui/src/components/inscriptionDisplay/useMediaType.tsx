
import { useMemo } from "react";
import { MediaType } from "../../sdk";

const extensionToMediaType = (ext: string): MediaType => {
  if (ext === "svg") {
    return {
      image: {
        subtype: "svg+xml",
      },
    };
  } else if (ext === "png") {
    return {
      image: {
        subtype: "png",
      },
    };
  } else if (ext === "txt") {
    return {
      text: {
        subtype: "*",
      },
    };
  }
  
  else if (ext === "jpg" || ext === "jpeg") {
    return {
      image: {
        subtype: "jpeg",
      },
    };
  } else {
    return {
      custom: {
        mediaType: `image/${ext}`,
      },
    };
  }
};

export const mediaTypeToString = (mediaType: MediaType) => {
    // TODO: Do this better - there's gotta be a way!
    return mediaType.image ? `image/${mediaType.image.subtype}` :
        mediaType.video ? `image/${mediaType.video.subtype}` :
        mediaType.erc721 ? `application/json` :
        mediaType.video ? `image/${mediaType.video.subtype}` :
        mediaType.text ? `application/text` :
        // populate other types as needed
        null;

}

export const getMediaType = (filename: string | undefined): MediaType => {
  const elems = filename?.split(".");
  return elems && elems?.length > 1 
    ? extensionToMediaType(elems[elems.length-1].toLocaleLowerCase())
    : { none: {} };
};

export const useMediaType = (filename: string | undefined): MediaType => {
  return useMemo(() => getMediaType(filename), [filename]);
};
