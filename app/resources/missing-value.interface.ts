export interface IMissingValue {
  isMissing: () => boolean;
}

export interface MissingValueCtr {
  new (): IMissingValue;
}

export default IMissingValue;
