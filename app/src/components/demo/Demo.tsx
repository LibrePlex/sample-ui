import {
  Box,
  BoxProps,
  Button,
  Collapse,
  Heading,
  LinkBox,
  LinkOverlay,
  Tab,
  TabPanels,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { StyledTabs } from "components/tabs/Tabs";
import { Collection } from "generated/libreplex";
import {
  decodeCollectionPermission,
  usePermissionsByUser,
} from "query/permissions";
import { ReactNode, useMemo, useState } from "react";
import { CollectionsPanel } from "./collections/CollectionsPanel";
import { EditCollectionDialog } from "./collections/EditCollectionDialog";
import { DeleteCollectionPermissionsTransactionButton } from "./permissions/DeleteCollectionPermissionsTransactionButton";
import { PermissionsPanel } from "./permissions/PermissionsPanel";
import useSelectedPermissions from "./permissions/useSelectedPermissions";
import { DeleteCollectionTransactionButton } from "./collections/DeleteCollectionButton";
import useSelectedCollections from "./collections/useSelectedCollections";
import { decodeCollection } from "query/collections";

enum View {
  Collections = "Collections",
  Permissions = "Permissions",
  Metadata = "Metadata",
  Repos = "Repos",
}

const TabPanel = ({
  children,
  open,
  ...rest
}: { open: boolean; children: ReactNode } & BoxProps) => {
  return (
    <Collapse in={open}>
      <Box w={[400, 600, 800]}>
        <Box {...rest}>{children}</Box>
      </Box>
    </Collapse>
  );
};

export const Demo = () => {
  const selectedPermissionKeys = useSelectedPermissions(
    (state) => state.selectedPermissionKeys
  );

  const { publicKey } = useWallet();

  const { connection } = useConnection();

//   const [isSmallerThan600] = useMediaQuery("(max-width: 600px)");
  const [isSmallerThan800] = useMediaQuery("(max-width: 800px)");

  const [view, setView] = useState<View>(View.Collections);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      w={[400, 600, 800]}
      rowGap={3}
    >
      <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-10 pb-5">
        LibrePlex Manager
      </h1>
      {/* {selectedPermissionKeys.size} */}
      <Box
        display="flex"
        flexDirection={isSmallerThan800 ? "column" : "row"}
        columnGap={2}
        w={[400, 600, 800]}
      >
        <Button
          colorScheme="teal"
          variant={view === View.Collections ? "solid" : "outline"}
          onClick={() => {
            setView(View.Collections);
          }}
        >
          Collections
        </Button>
        <Button
          colorScheme="teal"
          variant={view === View.Permissions ? "solid" : "outline"}
          onClick={() => {
            setView(View.Permissions);
          }}
        >
          Permissions
        </Button>
        <Button
          colorScheme="teal"
          variant={view === View.Metadata ? "solid" : "outline"}
          onClick={() => {
            setView(View.Metadata);
          }}
        >
          Metadata
        </Button>
        <Button
          colorScheme="teal"
          variant={view === View.Repos ? "solid" : "outline"}
          onClick={() => {
            setView(View.Repos);
          }}
        >
          Repos
        </Button>
      </Box>

      <TabPanel
        open={view === View.Collections}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
        }}
      >
        <CollectionsPanel />
      </TabPanel>

      <TabPanel
        open={view === View.Permissions}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
        }}
      >
        <PermissionsPanel />
      </TabPanel>
      <TabPanel open={view === View.Repos}>
        <Box
          display="flex"
          columnGap={2}
          flexDirection={isSmallerThan800 ? "column" : "row"}
          alignItems={isSmallerThan800 ? "center" : "row"}
        >
          <LinkBox as="article" maxW="sm" p="5" borderWidth="1px" rounded="md">
            <Heading size="md" my="2">
              <LinkOverlay href="https://github.com/LibrePlex/metadata">
                Contracts
              </LinkOverlay>
            </Heading>
            <Text>Released under MIT License</Text>
            <Text>Click here for the repo!</Text>
            <Text>https://github.com/LibrePlex/metadata</Text>
          </LinkBox>
          <LinkBox as="article" maxW="sm" p="5" borderWidth="1px" rounded="md">
            <Heading size="md" my="2">
              <LinkOverlay href="https://github.com/LibrePlex/sample-ui">
                Reference UI (this website)
              </LinkOverlay>
            </Heading>
            <Text>Released under Apache 2.0 License</Text>
            <Text>Click here for the repo!</Text>
            <Text>https://github.com/LibrePlex/sample-ui</Text>
          </LinkBox>
        </Box>
      </TabPanel>
    </Box>
  );
};
