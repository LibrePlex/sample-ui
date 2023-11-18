import { fileTypeFromStream } from "file-type";
export const getFiletypeFromStream = async (imageUrl: string | undefined) => {

  if (imageUrl) {

    /// hack for no
    try {
      const response = await fetch(imageUrl, {
        method: "GET",
      });

      const a = (await response.text()).trimStart()

      if( a.startsWith("<svg") || a.startsWith("<SVG")) {
        return "image/svg+xml"
      }
      
    } catch (e) {
      console.log({ e });
    }

    try {
      const response = await fetch(imageUrl, {
        method: "HEAD",
      });


      
      const contentType = response.headers.get("Content-Type") as string | undefined;;
      if( contentType) {
        return contentType.split(";")[0]
      }
      
    } catch (e) {
      console.log({ e });
      return null;
    }
  } else {
    return null;
  }
};
