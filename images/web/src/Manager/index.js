
import React from "react"
import { reducer, initialState } from "./reducer"

export const ManagerContext = React.createContext({
  state: initialState,
  dispatch: () => null
})

export const ManagerProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  return (
    <ManagerContext.Provider value={[ state, dispatch ]}>
      { children }
    </ManagerContext.Provider>
  )
}