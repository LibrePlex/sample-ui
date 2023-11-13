import { Program, IdlTypes } from "@coral-xyz/anchor";

import { LibreplexInscriptions } from "../../../anchor/libreplex_inscriptions";
import { createStore } from "zustand";
import { PublicKey } from "@solana/web3.js";

export type InscriptionEventData = IdlTypes<LibreplexInscriptions>["InscriptionEventData"];

interface InscriptionWrites {
  writeStates: { [key: string]: number };
  updatedInscriptionData: { [key: string]: Buffer | undefined };
  // updatedInscriptionSizes: { [key: string]: number | undefined};
  updatedInscription: { [key: string]: InscriptionEventData};
}

export interface InscriptionLiveEventState extends InscriptionWrites {
  incrementWriteStatus: (inscriptionKey: string) => void;
  resetWriteStatus: (inscriptionKey: string) => void;
  setUpdatedInscriptionData: (inscriptionKey: string, buf: Buffer) => void;
  // setUpdatedInscriptionSize: (inscriptionKey: string, size: number) => void;
  setUpdatedInscription: (inscriptionKey: string, data: InscriptionEventData) => void;
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
    // updatedInscriptionSizes: {},
    updatedInscription: {}
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
    setUpdatedInscription: (inscriptionKey: string, data: InscriptionEventData) => {
      return set((state) => {
        return {
          ...state,

          updatedInscription: {
            ...state.updatedInscription,
            [inscriptionKey]: data,
          },
        };
      });
    },
   
   
    // setUpdatedInscriptionSize: (
    //   inscriptionKey: string,
    //   size: number | undefined
    // ) => {
    //   return set((state) => {

    //     console.log({ state, size, inscriptionKey });
    //     const newState = {
    //       ...state,
    //       dummy: 2,
    //       updatedInscriptionSizes: {
    //         ...state.updatedInscriptionSizes,
    //         [inscriptionKey]: size,
    //       },
    //     };
    //     console.log({newState})
    //     return newState
    //   });
    // },
  }));
  const state = store.getState();


  program?.addEventListener("InscriptionResizeFinal", (event: {
    id: PublicKey,
    data: InscriptionEventData
  }, slot, sig) => {
    console.log('Inscription resize final triggered', event);
    state.setUpdatedInscription(event.id.toBase58(), event.data);
  });

  program?.addEventListener("InscriptionWriteEvent", (event, slot, sig) => {
    state.incrementWriteStatus(event.id.toBase58());
  });

  program?.addEventListener("InscriptionEventCreate", (event: {
    id: PublicKey,
    data: InscriptionEventData
  }, slot, sig) => {
    // console.log({id: event.id.toBase58(), data: event.data});
    state.setUpdatedInscription(event.id.toBase58(), event.data);
  });

  program?.addEventListener("InscriptionEventUpdate", (event: {
    id: PublicKey,
    data: InscriptionEventData
  }, slot, sig) => {
    // console.log({event});
    state.setUpdatedInscription(event.id.toBase58(), event.data);
  });


  console.log('Adding resize event');


  return store;
};
