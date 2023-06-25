import {
    GridItem,
    Text,
    Card,
    Heading,
    Stack,
  } from "@chakra-ui/react";
  
  
  export const DesignObjectivesGrid = (props: {header: string}) => {
    return (
        <GridItem colSpan={1} display={"flex"}>
        <Card p={3} borderRadius={"15px"} w={"100%"} variant={"outline"} bg={"#00000000"}>
          <Stack>
            <Heading textAlign={"center"} fontSize={{base: "sm", md: "lg"}}>
              {props.header}
            </Heading>
          </Stack>
        </Card>
      </GridItem>
    );
  };
  