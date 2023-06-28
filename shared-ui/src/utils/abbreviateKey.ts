export const abbreviateKey = (key: string, numberOfDigits?: number) => {
    return key.length > (numberOfDigits || 3) * 2
      ? `${key.slice(0, numberOfDigits || 3)}...${key.slice(
          -(numberOfDigits || 3)
        )}`
      : key;
  };
  