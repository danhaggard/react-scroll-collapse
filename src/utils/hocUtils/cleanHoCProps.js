import { filterObject } from '../objectUtils';


export const cleanHoCProps = ( // eslint-disable-line
  props,
  propTypes,
  arr
) => filterObject(props, propTypes, arr);
