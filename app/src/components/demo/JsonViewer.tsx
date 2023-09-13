import {
  Box,
  BoxProps,
  Button,
  Collapse,
  FormControl,
  FormLabel,
  Heading,
  Input,
  LinkBox,
  LinkOverlay,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ReactNode, useEffect, useState } from "react";
import { CollectionsPanel } from "./collections/CollectionsPanel";
import useSelectedPermissions from "./permissions/useSelectedPermissions";
import { BaseMetadataPanel } from "./metadata/MetadataPanel";
import ReactJson from "react-json-view";
import {
  useMetadataById,
  useNetworkConfiguration,
  usePublicKeyOrNull,
} from  "@libreplex/shared-ui";

export const JsonViewer = ({obj}:{obj: any}) => {

  return <ReactJson theme="monokai" src={obj??{}}/>
};
