import create, { State } from "zustand";
import produce from "immer";

interface NotificationStore extends State {
  notifications: Array<{
    type: string
    message: string
    description?: string
    txid?: string
  }>
  set: (x: any) => void
}

export const useNotificationStore = create<NotificationStore>((set, _get) => ({
  notifications: [],
  set: (fn) => set(produce(fn)),
}))

