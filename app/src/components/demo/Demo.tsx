import {
  Box,
  Button,
  Heading,
  LinkBox,
  LinkOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { StyledTabs } from "components/tabs/Tabs";
import { Collection, CollectionPermissions } from "generated/libreplex";
import { useMemo, useState } from "react";
import { EditCollectionDialog } from "./collections/EditCollectionDialog";
import { CollectionsPanel } from "./collections/CollectionsPanel";
import { QueryClient, QueryClientProvider } from "react-query";
import { PermissionsPanel } from "./permissions/PermissionsPanel";
import useSelectedPermissions from "./permissions/useSelectedPermissions";
import { DeleteCollectionPermissionsTransactionButton } from "./permissions/DeleteCollectionPermissionsTransactionButton";
import { usePermissions } from "query/permissions";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { IRpcObject } from "components/executor/IRpcObject";
export const Demo = () => {
  const [editorStatus, setEditorStatus] = useState<{
    open: boolean;
    collection: Collection | undefined;
  }>({
    open: false,
    collection: undefined,
  });

  const selectedPermissionKeys = useSelectedPermissions(
    (state) => state.selectedPermissionKeys
  );

  const { publicKey } = useWallet();

  const { connection } = useConnection();

  const {
    data: permissions,
    isFetching,
    refetch,
  } = usePermissions(publicKey, connection);

  const permissionDict = useMemo(() => {
    const _permissionDict: {
      [key: string]: IRpcObject<CollectionPermissions>;
    } = {};
    for (const permission of permissions) {
      _permissionDict[permission.pubkey.toBase58()] = permission;
    }
    return _permissionDict;
  }, [permissions]);

  const params = useMemo(
    () => {
        console.log({selectedPermissionKeys})
      return selectedPermissionKeys
        ? [...selectedPermissionKeys]
            .filter((item) => permissionDict[item.toBase58()])
            .map((pubkey) => ({
              collectionPermissions: pubkey,
              collection: permissionDict[pubkey.toBase58()].item.collection,
            }))
        : []
    },
    [selectedPermissionKeys, permissionDict]
  );

  return (
    <Box
      sx={{
        maxWidth: "600px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      rowGap={3}
    >
      <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-10 pb-5">
        Metadata Manager
      </h1>
      {/* {selectedPermissionKeys.size} */}
      <StyledTabs>
        <TabList>
          <Tab>Collections</Tab>
          <Tab>Permissions</Tab>
          <Tab>Metadata</Tab>
          <Tab>Repos</Tab>
          {/* <Tab>Royalties</Tab>
          <Tab>Creator verification</Tab> */}
        </TabList>

        <TabPanels>
          <TabPanel
            pl={"30px"}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <Button
              onClick={() =>
                setEditorStatus({ open: true, collection: undefined })
              }
            >
              Create Collection
            </Button>

            <EditCollectionDialog
              open={editorStatus.open}
              onClose={() => {
                setEditorStatus({
                  open: false,
                  collection: undefined,
                });
              }}
            />
            <CollectionsPanel />
          </TabPanel>

          <TabPanel
            pl={"30px"}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "start",
              }}
            >
              <Button
              // onClick={() =>
              //   setEditorStatus({ open: true, collection: undefined })
              // }
              >
                Create Permission
              </Button>
              {selectedPermissionKeys.size > 0 && (
                <DeleteCollectionPermissionsTransactionButton
                  params={params}
                  formatting={{}}
                />
              )}
            </Box>

            <EditCollectionDialog
              open={editorStatus.open}
              onClose={() => {
                setEditorStatus({
                  open: false,
                  collection: undefined,
                });
              }}
            />
            <PermissionsPanel />
          </TabPanel>
          <TabPanel>
            <Box display="flex" columnGap={2}>
              <LinkBox
                as="article"
                maxW="sm"
                p="5"
                borderWidth="1px"
                rounded="md"
              >
                <Heading size="md" my="2">
                  <LinkOverlay href="https://github.com/LibrePlex/metadata">
                    Contracts
                  </LinkOverlay>
                </Heading>
                <Text>Released under MIT License</Text>
                <Text>Click here for the repo!</Text>
                <Text>https://github.com/LibrePlex/metadata</Text>
              </LinkBox>
              <LinkBox
                as="article"
                maxW="sm"
                p="5"
                borderWidth="1px"
                rounded="md"
              >
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
        </TabPanels>
      </StyledTabs>
    </Box>
  );
};
