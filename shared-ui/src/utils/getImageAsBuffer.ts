import  axios  from 'axios';
export const getImageAsBuffer = async (imageUrl: string) => {
  console.log(`Fetching url ${imageUrl}`);
    const offChainImage = await axios
      .request<ArrayBuffer>({
        responseType: "arraybuffer",
        url: imageUrl,
        method: "get",
      })
      .then((result) => {
        console.log({result});
        return result.data
      });
    // console.log({offChainImage});
    //   console.log({bufferlenbefore: ([...offChainImage as any]).length});
  
    console.log(`returning ${offChainImage}`);
    return Buffer.from(offChainImage);
    // return webpBuffer as Buffer;
  };