import NextLink from "next/link";
import {
  Text,
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  Button,
  CardProps,
} from "@chakra-ui/react";
import { CreateDeploymentDialog } from "./CreateDeploymentDialog";

export const CreateNewCard = ({...rest}: CardProps) => {
  return (
    <Card {...rest}>
      <CardHeader>
        <Heading size="md">Create token launch</Heading>
        <CardBody>
          <VStack alignContent="center">
            <CreateDeploymentDialog />
          </VStack>
        </CardBody>
      </CardHeader>
    </Card>
  );
};
