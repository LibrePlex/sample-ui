export interface IShadowDriveUpload {
    upload: {
      signature: string;
      filename: string;
    };
    delete: {
      signature: string;
      url: string;
    };
    signer: string;
  }
  