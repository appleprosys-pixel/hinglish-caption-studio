export type CaptionSegment = {
  start: string;
  end: string;
  text: string;
};

export function toSrtTime(value: string) {
  return value.replace(".", ",");
}

export function captionsToSrt(captions: CaptionSegment[]) {
  return captions
    .map(
      (caption, index) =>
        `${index + 1}\n${toSrtTime(caption.start)} --> ${toSrtTime(caption.end)}\n${caption.text}\n`,
    )
    .join("\n");
}
