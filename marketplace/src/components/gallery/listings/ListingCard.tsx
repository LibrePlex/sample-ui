import React from "react";
import { MintCard } from "../../mintcard/MintCard";
import { IRpcObject, Listing } from "shared-ui";
import { PublicKey } from "@solana/web3.js";

export const ListingCard = ({ listing }: { listing: IRpcObject<Listing> }) => {
  return <MintCard mint={listing.item.mint}>bla bla</MintCard>;
};
