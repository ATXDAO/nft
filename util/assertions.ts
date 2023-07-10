export function assertValidTokenUri(tokenUri: string, dynamic = true): void {
  if (!tokenUri.startsWith('ipfs://')) {
    throw new Error(
      `expected token URI to be prefixed with 'ipfs://', got ${tokenUri}`
    );
  }

  if (dynamic && !tokenUri.endsWith('/')) {
    throw new Error(
      `dynamic mint token-uri should be end with a "/", got: ${tokenUri}`
    );
  }
}
