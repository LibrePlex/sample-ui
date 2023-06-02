import {
  Box,
  Heading,
  ListItem,
  OrderedList
} from "@chakra-ui/react";
import { FC } from "react";

export const MetadataBasics: FC = ({}) => {
  return (
    <Box>
      <Heading fontSize="xl" style={{ paddingTop: "15px" }}>
        Unchanged
      </Heading>

      <Box>
        <OrderedList
          sx={{
            maxWidth: "800px",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <ListItem>Name</ListItem>
        </OrderedList>
      </Box>
      <Heading fontSize="xl" style={{ paddingTop: "15px" }}>
        Propose to change
      </Heading>

      <Box>
        <OrderedList
          sx={{
            maxWidth: "800px",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <ListItem>Off-chain attributes made optional</ListItem>
          <ListItem>Authority moved to collection</ListItem>
          <ListItem>Symbol moved to collection</ListItem>
          <ListItem>
            Creators (verified status removed from royalty array)
          </ListItem>
          <ListItem>Royalties (handled independently from creators)</ListItem>
        </OrderedList>
      </Box>
      <Heading fontSize="xl" style={{ paddingTop: "15px" }}>
        New
      </Heading>
      <Box>
        <OrderedList
          sx={{
            maxWidth: "800px",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <ListItem>
            Creator verification (done independently from royalties)
          </ListItem>
          <ListItem>On-chain attributes</ListItem>
          <ListItem>URL to allow base64 and ordinals</ListItem>
        </OrderedList>
      </Box>
      <Heading fontSize="xl" style={{ paddingTop: "15px" }}>
        Active discussion
      </Heading>
      <Box>
        <OrderedList
          sx={{
            maxWidth: "800px",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <ListItem>Delegation types</ListItem>
          <ListItem>
            Royalty enforcement mechanism (token-2022 -v- metadata)
          </ListItem>
          <ListItem>Dynamic rendering engines / modes</ListItem>
          <ListItem>Licensing</ListItem>
        </OrderedList>
      </Box>
    </Box>
  );
};
