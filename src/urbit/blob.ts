export function serializeContextLensReferenceBlob(lensId: string): string {
  return JSON.stringify([
    {
      type: "tlon-context-lens",
      version: 1,
      lensId,
    },
  ]);
}
