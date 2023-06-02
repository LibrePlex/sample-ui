import { PublicKey } from "@solana/web3.js";

export const deleteFromShadowDrive = async (
  signer: string,
  url: string,
  signature: string
) => {
  const uploadResponse = await fetch(
    `https://shadow-storage.genesysgo.net/delete-file`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        signer: new PublicKey(signer),
        message: signature,
        location: url,
      }),
    }
  );
  if (!uploadResponse.ok) {
    return Promise.reject(
      new Error(`Server response status code: ${uploadResponse.status} \n
                      Server response status message: ${
                        (await uploadResponse.json()).error
                      }`)
    );
  }

  const responseJson = await uploadResponse.json();
};
