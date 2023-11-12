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
    return Buffer.from(offChainImage);
  };