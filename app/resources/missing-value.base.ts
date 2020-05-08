import IMissingValue from './missing-value.interface';

export default class MissingValue implements IMissingValue {
  /**
   * Determine if the object should be considered missing
   *
   * @return {Boolean}
   */
  isMissing() {
    return true;
  }
}