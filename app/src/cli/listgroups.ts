
const sha256 = require("js-sha256");
const bs58 = require("bs58");

const web3 = require( "@solana/web3.js");
  



const PROGRAM_ID =  new web3.PublicKey("LibrQsXf9V1DmTtJLkEghoaF1kjJcAzWiEGoJn8mz7p");

const dotenv = require("dotenv");
dotenv.config({ path: `.env` });



(async () => {
  const connection = new web3.Connection(process.env.DEVNET_URL!, "confirmed");

  const filters = [
    {
      memcmp: {
        offset: 0,
        bytes: bs58.encode(sha256.array("account:Collection").slice(0, 8)),
      },
    },
  ];

  const accounts = await connection.getProgramAccounts(PROGRAM_ID, {
    filters,
  });

  console.log(accounts.map(item=>`"${item.pubkey.toBase58()}"`).join(","))


})()
  .catch((e) => {
    console.log(e);
  })
  .finally(async () => {
    //    await prisma.$disconnect();
  });
