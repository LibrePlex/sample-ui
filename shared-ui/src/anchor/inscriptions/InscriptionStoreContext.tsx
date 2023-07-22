// Provider implementation
import { Text } from "@chakra-ui/react";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef
} from "react";
import {
  InscriptionsProgramContext
} from "shared-ui";
import { StoreApi } from "zustand";
import {
  InscriptionLiveEventState,
  InscriptionWriteStore,
  createInscriptionLiveEventStore as createInscriptionLiveEventStore,
} from "./inscriptionLiveEventStore";

export const InscriptionStoreContext =
  createContext<InscriptionWriteStore | null>(null);

export const InscriptionStoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const program = useContext(InscriptionsProgramContext);

  const store = useRef<StoreApi<InscriptionLiveEventState>>();

  useEffect(() => {
    if (program) {
      store.current = createInscriptionLiveEventStore(program);
    }
  }, [program]);

  return store.current ? (
    <InscriptionStoreContext.Provider value={store.current}>
      {children}
    </InscriptionStoreContext.Provider>
  ) : (
    <Text>Initializing store...</Text>
  );
};
