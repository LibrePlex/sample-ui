import type { NextPage } from "next";
import React from "react";
import { ListingGallery } from "../../components/gallery/listings/Listings";
const Home: NextPage = (props) => {
  return (
    <div>
      <ListingGallery />
    </div>
  );
};

export default Home;
