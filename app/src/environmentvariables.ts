

export const NEXT_PUBLIC_SHDW_ACCOUNT = process.env.NEXT_PUBLIC_SHDW_ACCOUNT;
export const SHDW_DRIVE_OWNER_SECRET_KEY = process.env.SHDW_DRIVE_OWNER_SECRET_KEY;
export const NEXT_PUBLIC_STORAGE_BUCKET_KEY = process.env.NEXT_PUBLIC_STORAGE_BUCKET_KEY;
export const NEXT_PUBLIC_DEVNET_URL = process.env.NEXT_PUBLIC_DEVNET_URL;
export const NEXT_PUBLIC_MAINNET_URL = process.env.NEXT_PUBLIC_MAINNET_URL;
/// we need two sets of urls as one will be whitelisted (the public facing one)
/// and the other will not
export const LOCALNET_URL = process.env.LOCALNET_URL || 'http://localhost:8899';
export const DEVNET_URL = process.env.DEVNET_URL;
export const MAINNET_URL = process.env.MAINNET_URL;
export const JWT_SYSTEM_SIGNING_KEY = process.env.JWT_SYSTEM_SIGNING_KEY;
export const COOKIE_KEY_AUTH = 'cookie-auth';

export const LEGACY_SIGNER_PRIVATE_KEY = process.env.LEGACY_SIGNER_PRIVATE_KEY;

export const NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID = process.env.NEXT_PUBLIC_LEGACY_INSCRIPTIONS_PROGRAM_ID || "Leg1xVbrpq5gY6mprak3Ud4q4mBwcJi5C9ZruYjWv7n";