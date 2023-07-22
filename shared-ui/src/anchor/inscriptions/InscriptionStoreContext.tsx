// Provider implementation
import { Text } from "@chakra-ui/react";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
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

  const [store, setStore] = useState<StoreApi<InscriptionLiveEventState>>();

  useEffect(() => {
    if (program?.programId) {
      setStore(createInscriptionLiveEventStore(program));
    }
  }, [program]);

  return store ? (
    <InscriptionStoreContext.Provider value={store}>
      {children}
    </InscriptionStoreContext.Provider>
  ) : (
    <Text>Initializing store...</Text>
  );
};
