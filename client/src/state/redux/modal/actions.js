import * as types from "./types";

const openModal = () => ({
  type: types.OPEN_MODAL
})

const closeModal = () => ({
  type: types.CLOSE_MODAL
})

export {
  openModal, closeModal
}