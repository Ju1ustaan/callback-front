import { create } from 'zustand'

const useStore = create((set) => ({
  snackbar: false,
  showSnackbar: (value) => set(() => ({ snackbar: value })),
  detailform: {},
  pushDetailForm: (value) => set(() => ({ detailform: value })),
  photo1: {},
  setPhotoFile1: (value) => set(() => ({ photo1: value })),
  photo2: {},
  setPhotoFile2: (value) => set(() => ({ photo2: value })),
  photo3: {},
  setPhotoFile3: (value) => set(() => ({ photo3: value })),
}))

export { useStore }