import { Program } from "@coral-xyz/anchor";
import { LibreplexInscriptions } from "shared-ui";
import { createStore } from "zustand";

interface InscriptionWrites {
  writeStates: { [key: string]: number };
  updatedInscriptionData: { [key: string]: Buffer | undefined };
  updatedInscriptionSizes: { [key: string]: number | undefined};
}

export interface InscriptionLiveEventState extends InscriptionWrites {
  incrementWriteStatus: (inscriptionKey: string) => void;
  resetWriteStatus: (inscriptionKey: string) => void;
  setUpdatedInscriptionData: (inscriptionKey: string, buf: Buffer) => void;
  setUpdatedInscriptionSize: (inscriptionKey: string, size: number) => void;
}

export type InscriptionWriteStore = ReturnType<
  typeof createInscriptionLiveEventStore
>;

export const createInscriptionLiveEventStore = (
  program: Program<LibreplexInscriptions>,
  initProps?: Partial<InscriptionWrites>
) => {
  const DEFAULT_PROPS: InscriptionWrites = {
    writeStates: {},
    updatedInscriptionData: {},
    updatedInscriptionSizes: {},
  };

  const store = createStore<InscriptionLiveEventState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    resetWriteStatus: (inscriptionKey: string) => {
      set((state) => ({
        ...state,
        writeStates: {
          ...state.writeStates,
          [inscriptionKey]: 0,
        },
        updatedInscriptionData: {
          ...state.updatedInscriptionData,
          [inscriptionKey]: undefined,
        },
      }));
    },
    incrementWriteStatus: (inscriptionKey: string) => {
      return set((state) => {
        return {
          ...state,
          writeStates: {
            ...state.writeStates,
            [inscriptionKey]: (state.writeStates[inscriptionKey] ?? 0) + 1,
          },
        };
      });
    },
    setUpdatedInscriptionData: (inscriptionKey: string, buf: Buffer) => {
      return set((state) => {
        return {
          ...state,

          updatedInscriptionData: {
            ...state.updatedInscriptionData,
            [inscriptionKey]: buf,
          },
        };
      });
    },
   
    setUpdatedInscriptionSize: (
      inscriptionKey: string,
      size: number | undefined
    ) => {
      return set((state) => {

        console.log({ state, size, inscriptionKey });
        const newState = {
          ...state,
          dummy: 2,
          updatedInscriptionSizes: {
            ...state.updatedInscriptionSizes,
            [inscriptionKey]: size,
          },
        };
        console.log({newState})
        return newState
      });
    },
  }));
  const state = store.getState();


  program?.addEventListener("InscriptionResizeFinal", (event, slot, sig) => {
    // state.setDummy();
    state.setUpdatedInscriptionSize(event.id.toBase58(), Number(event.size));
  });

  program?.addEventListener("InscriptionWriteEvent", (event, slot, sig) => {
    state.incrementWriteStatus(event.id.toBase58());
  });

  console.log('Adding resize event');


  return store;
};
