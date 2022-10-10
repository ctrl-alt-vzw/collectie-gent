
const phases = {
  PICK: 0,
  CUT: 1,
  DROP: 2,
  WATCH: 3
}

const options = {
  scale: {
    viewing: 1,
    dropping: 1
  }
}


export const reducer = (state, action) => {
  switch (action.type) {
    case "pick_annotation":
        return {
          ...state,
          annotation: action.payload,
          phase: phases.CUT
        }
      case "cut_finished":
        return {
          ...state,
          clipping: action.payload,
          phase: phases.DROP
        }
      case "clipping_positioned":
        return {
          ...state, 
          clipping: action.payload,
          phase: phases.WATCH
        }
      case "reset_and_select":
        return {
          ...state,
          phase: phases.PICK,
          clipping: {},
          annotation: {}
        }
    default:
      return state
  }
}

export const initialState = {
    "phase": phases.WATCH,
    "clipping": {},
    "annotation": {},
    "options": options
}