import { describe, it, expect } from "bun:test";
import { InstanceId } from "../../../src/domain/value-objects/InstanceId";

describe("InstanceId", () => {
  describe("create", () => {
    it("should create an InstanceId from a valid positive integer", () => {
      const id = InstanceId.create(123);
      expect(id.value).toBe(123);
    });

    it("should throw an error for zero", () => {
      expect(() => InstanceId.create(0)).toThrow("InstanceId must be a positive integer");
    });

    it("should throw an error for negative numbers", () => {
      expect(() => InstanceId.create(-1)).toThrow("InstanceId must be a positive integer");
    });

    it("should throw an error for non-integer values", () => {
      expect(() => InstanceId.create(1.5)).toThrow("InstanceId must be a positive integer");
    });
  });

  describe("fromString", () => {
    it("should create an InstanceId from a valid string", () => {
      const id = InstanceId.fromString("456");
      expect(id.value).toBe(456);
    });

    it("should throw an error for invalid string", () => {
      expect(() => InstanceId.fromString("abc")).toThrow("Invalid InstanceId string: abc");
    });

    it("should throw an error for empty string", () => {
      expect(() => InstanceId.fromString("")).toThrow("Invalid InstanceId string: ");
    });
  });

  describe("equals", () => {
    it("should return true for equal InstanceIds", () => {
      const id1 = InstanceId.create(123);
      const id2 = InstanceId.create(123);
      expect(id1.equals(id2)).toBe(true);
    });

    it("should return false for different InstanceIds", () => {
      const id1 = InstanceId.create(123);
      const id2 = InstanceId.create(456);
      expect(id1.equals(id2)).toBe(false);
    });

    it("should return false for non-InstanceId objects", () => {
      const id = InstanceId.create(123);
      // @ts-expect-error - testing with non-InstanceId
      expect(id.equals("123")).toBe(false);
    });
  });

  describe("toString", () => {
    it("should return string representation of the value", () => {
      const id = InstanceId.create(789);
      expect(id.toString()).toBe("789");
    });
  });

  describe("toJSON", () => {
    it("should return the numeric value", () => {
      const id = InstanceId.create(999);
      expect(id.toJSON()).toBe(999);
    });
  });

  describe("immutability", () => {
    it("should not allow modification of the value", () => {
      const id = InstanceId.create(123);
      // @ts-expect-error - testing immutability
      expect(() => {
        id.value = 456;
      }).toThrow();
    });
  });
});
