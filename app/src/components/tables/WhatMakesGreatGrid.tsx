import {
    GridItem,
    Text,
    Card,
    Heading,
    Stack,
  } from "@chakra-ui/react";
  
  
  export const WhatMakesGreatGrid = (props: {header: string; text: string}) => {
    return (
        <GridItem colSpan={1} display={"flex"}>
        <Card p={3} borderRadius={"15px"} w={"100%"} variant={"outline"} bg={"#00000000"}>
          <Stack>
            <Heading fontSize={{base: "md", md: "xl"}}>
              {props.header}
            </Heading>
            <Text fontSize={{base: "xs", md: "sm"}} color={"gray.200"}>
              {props.text}
            </Text>
          </Stack>
        </Card>
      </GridItem>
    );
  };
  