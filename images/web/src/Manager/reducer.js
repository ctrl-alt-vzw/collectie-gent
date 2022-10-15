
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

// export const initialState = {
//     "phase": phases.WATCH,
//     "clipping": {},
//     "annotation": {},
//     "options": options
// }

export const initialState = {
    "phase": 2,
    "clipping": {
        "id": 128,
        "imageURI": "http://media.datacratie.cc/uploads/800/clipping-1665836325005-561088958.png",
        "UUID": "1adf2205-af71-43a0-958a-324ae46b0d04",
        "originID": "u",
        "collection": "u",
        "placedAt": "",
        "x": 10,
        "y": 10,
        "created_at": "2022-10-15T12:18:45.588Z",
        "updated_at": "2022-10-15T12:18:45.588Z",
        "width": 252,
        "height": 214,
        "normalURI": "http://media.datacratie.cc/uploads/normal/normal-1665836325251-41767611.png"
    },
    "annotation": {
        "id": 95,
        "UUID": "3b4ba236-e578-4c7b-a21b-430c2e077df0",
        "gentImageURI": "https://api.collectie.gent/iiif/image/iiif/2/7db91c5a442908e6ad445003acad8c89-transcode-0957.jpg/full/full/0/default.jpg",
        "originID": "530013912",
        "collection": "dmg",
        "annotation": "wood carving of a pine cone.",
        "created_at": "2022-07-06T14:57:40.682Z",
        "updated_at": "2022-07-06T14:57:40.682Z",
        "imagedata": {
            "width": 3557,
            "height": 3271,
            "ratio": 1.0874350351574442,
            "colors": {
                "tl": [
                    155,
                    147,
                    145,
                    255
                ],
                "tr": [
                    146,
                    141,
                    139,
                    255
                ],
                "bl": [
                    144,
                    134,
                    130,
                    255
                ],
                "br": [
                    118,
                    112,
                    110,
                    255
                ]
            }
        },
        "originalAnnotation": null
    },
    "options": {
        "scale": {
            "viewing": 1,
            "dropping": 1
        },
        "canvasWidth": 2000
    }
}