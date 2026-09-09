import { describe, expect, it } from "vitest";
import { captionsToSrt, toSrtTime } from "../shared/captions";

describe("caption export utilities", () => {
  it("converts decimal timestamps to SRT timestamps", () => {
    expect(toSrtTime("00:02.18")).toBe("00:02,18");
  });

  it("creates numbered SRT blocks with readable spacing", () => {
    expect(
      captionsToSrt([
        { start: "00:00.00", end: "00:01.20", text: "Aaj ka idea simple hai." },
        { start: "00:01.20", end: "00:03.40", text: "Make it impossible to scroll past." },
      ]),
    ).toBe(
      "1\n00:00,00 --> 00:01,20\nAaj ka idea simple hai.\n\n2\n00:01,20 --> 00:03,40\nMake it impossible to scroll past.\n",
    );
  });
});
