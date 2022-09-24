const initialState = { support: [] };

export default function SupportReducer(state = initialState, action) {
  switch (action.type) {
    case "SUPPORT_SUCCESS":
      return {
        success: true,
        support: action.payload,
      };

    default:
      return state;
  }
}
