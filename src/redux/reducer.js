import {combineReducers} from 'redux';
import {FETCH_OUTLET} from './actionTypes';

const initialStateOutlet = {
  data: {
    via: '',
    outlet: null,
  },
};

const OutletReducer = (state = initialStateOutlet, action) => {
  switch (action.type) {
    case FETCH_OUTLET:
      return {
        data: {
          ...state.data,
          via: action.via,
          outlet: action.outlet,
        },
      };
    default:
      return state;
  }
};
export default combineReducers({
  OutletReducer,
});
