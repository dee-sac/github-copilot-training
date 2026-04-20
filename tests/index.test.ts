import { describe, expect, it } from "vitest";

import { createGreeting } from "../src/index.js";

describe("createGreeting", () => {
  it("returns the expected hello message", () => {
    expect(createGreeting()).toContain("Node + TypeScript");
  });
});
