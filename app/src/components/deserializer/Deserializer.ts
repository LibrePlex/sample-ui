import { PublicKey } from "@solana/web3.js";

export class SolanaDeserializer {
  private readonly buffer: Buffer;
  private offset: number;

  constructor(buffer: Buffer, offset: number) {
    this.buffer = buffer;
    this.offset = offset;
  }

  readPublicKey = (): PublicKey => {
    this.offset += 32;
    return new PublicKey(this.buffer.subarray(this.offset - 32, this.offset));
  };

  readBoolean = (): boolean => {
    this.offset += 1;
    return this.buffer[this.offset-1] > 0
  }
}
