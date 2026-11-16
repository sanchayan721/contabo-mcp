/**
 * Value Object representing a Contabo Instance ID.
 * Immutable and implements value equality.
 * Instances are identified by a positive integer ID assigned by Contabo.
 *
 * @example
 * ```typescript
 * const id = InstanceId.create(12345);
 * const id2 = InstanceId.fromString("12345");
 * console.log(id.equals(id2)); // true
 * ```
 * @public
 */
export class InstanceId {
  private readonly _value: number;

  /**
   * Creates a new InstanceId.
   * Private constructor - use static factory methods instead.
   * @param value - Positive integer instance ID
   * @throws {Error} If value is not a positive integer
   * @internal
   */
  private constructor(value: number) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error("InstanceId must be a positive integer");
    }
    this._value = value;
  }

  /**
   * Creates an InstanceId from a numeric value.
   * @param value - Positive integer instance ID
   * @returns New InstanceId instance
   * @throws {Error} If value is not a positive integer
   */
  public static create(value: number): InstanceId {
    return new InstanceId(value);
  }

  /**
   * Creates an InstanceId from a string representation.
   * @param value - String representation of instance ID
   * @returns New InstanceId instance
   * @throws {Error} If value is not a valid positive integer
   */
  public static fromString(value: string): InstanceId {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      throw new Error(`Invalid InstanceId string: ${value}`);
    }
    return new InstanceId(parsed);
  }

  /**
   * Returns the numeric value of this InstanceId.
   * @returns The instance ID as a number
   */
  public get value(): number {
    return this._value;
  }

  /**
   * Checks equality with another InstanceId.
   * Value-based equality: two InstanceIds are equal if their values match.
   * @param other - InstanceId to compare with
   * @returns true if values are equal, false otherwise
   */
  public equals(other: InstanceId): boolean {
    return other instanceof InstanceId && this._value === other._value;
  }

  /**
   * Returns the string representation of this InstanceId.
   * @returns String representation of the instance ID
   */
  public toString(): string {
    return this._value.toString();
  }

  /**
   * Returns the JSON-serializable value.
   * @returns The numeric instance ID
   */
  public toJSON(): number {
    return this._value;
  }
}
