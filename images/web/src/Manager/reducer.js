
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
  },
  canvasWidth: process.env.CANVAS_WIDTH ? process.env.CANVAS_WIDTH : 2000
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
// export const initialState = {
//     "phase": 2,
//     "clipping": {
//         "id": 5,
//         "imageURI": "http://localhost:3030/uploads/full/clipping-1665850381410-294837642.png",
//         "UUID": "f2fa7bd1-9026-4ae6-bf58-08726800ab98",
//         "originID": "u",
//         "collection": "u",
//         "placedAt": "",
//         "x": 10,
//         "y": 10,
//         "created_at": "2022-10-15T16:13:02.608Z",
//         "updated_at": "2022-10-15T16:13:02.608Z",
//         "width": 269,
//         "height": 254,
//         "normalURI": ""
//     },
//     "annotation": {
//         "id": 492,
//         "UUID": "af729d05-f564-4a62-928a-7635d307171d",
//         "gentImageURI": "https://api.collectie.gent/iiif/image/iiif/2/ae3c8854cee05345b24931f58bc06c74-transcode-2007-0036$1.jpg/full/full/0/default.jpg",
//         "originID": "530013269",
//         "collection": "dmg",
//         "annotation": "",
//         "created_at": "2022-09-07T13:25:03.594Z",
//         "updated_at": "2022-09-07T13:25:03.594Z",
//         "imagedata": {
//             "width": 3434,
//             "height": 5472,
//             "ratio": 0.6275584795321637,
//             "colors": {
//                 "tl": [
//                     192,
//                     196,
//                     188,
//                     255
//                 ],
//                 "tr": [
//                     0,
//                     0,
//                     0,
//                     0
//                 ],
//                 "bl": [
//                     177,
//                     185,
//                     188,
//                     255
//                 ],
//                 "br": [
//                     0,
//                     0,
//                     0,
//                     0
//                 ]
//             }
//         },
//         "originalAnnotation": null
//     },
//     "options": {
//         "scale": {
//             "viewing": 1,
//             "dropping": 1
//         },
//         "canvasWidth": 2000
//     }
// }
 