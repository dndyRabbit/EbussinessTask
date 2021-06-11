import {FETCH_OUTLET} from './actionTypes';

export const takeOutlet = (via, outlet) => {
  return {type: FETCH_OUTLET, via, outlet};
};
