import React from "react";

interface FullWidthBackgroundProps {
  imageUrl: string;
  children: React.ReactNode;
  overlayColor?: string;
}

const Background = ({
  imageUrl,
  overlayColor = "rgba(0, 0, 0, 0.75)",
  children,
}: FullWidthBackgroundProps) => {
  return (
    <div
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center bottom",
        backgroundSize: "cover",
        height: "45vh", // Change this to adjust the height of the image
        width: "100%",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      {children}
    </div>
  );
};

export default Background;
