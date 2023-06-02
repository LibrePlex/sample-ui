import { Box, Button, Checkbox, Collapse } from "@chakra-ui/react";
import { useState } from "react";

export const RoyalOverridePanel = () => {
  const [overrideOpen, setOverrideOpen] = useState<boolean>(false);
  return (
    <Box display="flex" flexDirection={"column"}>
      <Checkbox
        checked={overrideOpen}
        onChange={(e) => {
            setOverrideOpen(e.currentTarget.checked);
        }}
        colorScheme="red"
      >
        Override royalties / signers
      </Checkbox>
      <Collapse in={overrideOpen}>
        <Box p={2}>
          Individual mint level overrides are included in the standard. You can
          define royalty / permitted signer overrides here (though not wired up
          yet!)
        </Box>
      </Collapse>
    </Box>
  );

  // <Text pb={3}>
  //           Compared to the legacy standard, permitted signers in LibrePlex are
  //           completely independent of royalty recipients. So, no more creators
  //           with 0% royalties!
  //         </Text>
  //         <Stack>
  //           <Heading fontSize="xl">Royalties</Heading>
  //           <FormControl>
  //             <FormLabel>Royalties (basis points 0-10000)</FormLabel>
  //             <NumberInput
  //               min={0}
  //               max={10000}
  //               value={royaltyBps}
  //               onChange={(value) => setRoyaltyBps(+value)}
  //             >
  //               <NumberInputField />
  //             </NumberInput>
  //           </FormControl>
  //           <Text>{(royaltyBps / 100).toFixed(2)}%</Text>
  //           <Heading fontSize="lg">Royalty recipients</Heading>
  //           <Box
  //             sx={{
  //               display: "flex",
  //               alignItems: "end",
  //               width: "100%",
  //               justifyContent: "space-between",
  //             }}
  //             columnGap={2}
  //           >
  //             <FormControl>
  //               <FormLabel>New recipient</FormLabel>

  //               <Input
  //                 placeholder="Recipient public key"
  //                 value={royaltyRecipientStr}
  //                 onChange={(e) => setRoyaltyRecipientStr(e.currentTarget.value)}
  //               />
  //             </FormControl>

  //             {royaltyRecipient && (
  //               <Button
  //                 colorScheme="teal"
  //                 size="sm"
  //                 sx={{ mb: 1 }}
  //                 onClick={() => {
  //                   setRoyaltyShares((royaltyShares) => [
  //                     ...royaltyShares,
  //                     {
  //                       recipient: royaltyRecipient,
  //                       share: royaltyShares.length > 0 ? 0 : 10000,
  //                     },
  //                   ]);
  //                   setRoyaltyRecipientStr("");
  //                 }}
  //               >
  //                 <AddIcon />
  //               </Button>
  //             )}
  //           </Box>
  //           {royaltyRecipientStr.length > 0 && !royaltyRecipient && (
  //             <Text color="red">Please input a valid public key</Text>
  //           )}
  //           Royalty recipients: {royaltyShares.length}
  //           {royaltyShares.map((item, idx) => (
  //             <Box
  //               key={idx}
  //               sx={{ width: "100%" }}
  //               display="flex"
  //               justifyContent={"space-between"}
  //               alignItems={"center"}
  //               columnGap={2}
  //             >
  //               {abbreviateKey(item.recipient.toBase58(), 6)}
  //               <Text>Share</Text>
  //               <InputGroup>
  //                 <NumberInput
  //                   min={0}
  //                   max={10000}
  //                   value={item.share}
  //                   onChange={(value) =>
  //                     setRoyaltyShares((old) =>
  //                       old.map((item, idx2) =>
  //                         idx === idx2
  //                           ? {
  //                               ...item,
  //                               share: +value,
  //                             }
  //                           : item
  //                       )
  //                     )
  //                   }
  //                 >
  //                   <NumberInputField />
  //                 </NumberInput>
  //               </InputGroup>
  //               <Button
  //                 colorScheme="red"
  //                 size="sm"
  //                 onClick={() => {
  //                   setRoyaltyShares(
  //                     royaltyShares.filter((_, idx2) => idx2 !== idx)
  //                   );
  //                 }}
  //               >
  //                 <DeleteIcon />
  //               </Button>
  //             </Box>
  //           ))}
  //           {royaltyShares.length === 0 ? (
  //             <Text color="red">Please add at least one royalty recipient.</Text>
  //           ) : (
  //             totalShares !== 10000 && (
  //               <Text color="red">Total shares must add up to 10000</Text>
  //             )
  //           )}
  //           <Heading fontSize="xl">Permitted signers</Heading>
  //           <Box
  //             sx={{
  //               display: "flex",
  //               flexDirection: "column",
  //               alignItems: "end",
  //               width: "100%",
  //               justifyContent: "space-between",
  //             }}
  //             columnGap={2}
  //           >
  //             <Text sx={{ pb: 2 }}>
  //               Permitted signers allow the artist / creator to place their
  //               digital signature on the collection / individual items. This is
  //               useful when the artist is well known or for other reasons wishes
  //               to be identified as the creator of the collection / an individual
  //               NFT.
  //             </Text>

  //             <Box
  //               sx={{ display: "flex", width: "100%", alignItems: "end" }}
  //               columnGap={2}
  //             >
  //               <FormControl>
  //                 <FormLabel>New permitted signer</FormLabel>

  //                 <Input
  //                   placeholder="Permitted signer public key"
  //                   value={newPermittedSignerStr}
  //                   onChange={(e) =>
  //                     setNewPermittedSignerStr(e.currentTarget.value)
  //                   }
  //                 />
  //               </FormControl>

  //               {newPermittedSigner && (
  //                 <Button
  //                   colorScheme="teal"
  //                   size="sm"
  //                   disabled={!newPermittedSigner}
  //                   sx={{ mb: 1 }}
  //                   onClick={() => {
  //                     setPermittedSigners((old) => [...old, newPermittedSigner]);
  //                     setNewPermittedSignerStr("");
  //                   }}
  //                 >
  //                   <AddIcon />
  //                 </Button>
  //               )}
  //             </Box>
  //           </Box>
  //           {newPermittedSignerStr.length > 0 && !newPermittedSigner && (
  //             <Text color="red">Please input a valid public key</Text>
  //           )}
  //           {permittedSigners.map((item, idx) => (
  //             <Box
  //               key={idx}
  //               sx={{ width: "100%" }}
  //               display="flex"
  //               justifyContent={"space-between"}
  //               alignItems={"center"}
  //               columnGap={2}
  //             >
  //               {abbreviateKey(item.toBase58(), 6)}
  //               <Button
  //                 colorScheme="red"
  //                 size="sm"
  //                 onClick={() => {
  //                   setRoyaltyShares(
  //                     royaltyShares.filter((_, idx2) => idx2 !== idx)
  //                   );
  //                 }}
  //               >
  //                 <DeleteIcon />
  //               </Button>
  //             </Box>
  //           ))}
  //         </Stack>
  //       </Collapse>
};
