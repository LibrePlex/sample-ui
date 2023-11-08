import crypto from "crypto";

export const calculateHashFromBuffer = (buf: Buffer) => {
    const webpHashSum = crypto.createHash("sha256");
    webpHashSum.update(buf);
    const webpHash = webpHashSum.digest("hex");
    return webpHash
}