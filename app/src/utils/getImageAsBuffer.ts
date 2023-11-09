import  axios  from 'axios';
export const getImageAsBuffer = async (imageUrl: string) => {
    const offChainImage = await axios
      .request<Buffer>({
        responseType: "arraybuffer",
        url: imageUrl,
        method: "get",
      })
      .then((result) => result.data);
    // console.log({offChainImage});
    //   console.log({bufferlenbefore: ([...offChainImage as any]).length});
  
    return offChainImage;
    // return webpBuffer as Buffer;
  };