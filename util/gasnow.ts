import { BigNumber } from 'ethers';
import { fetchJson } from 'ethers/lib/utils';

type Level = 'slow' | 'standard' | 'fast' | 'rapid';

interface GasNowData extends Record<Level, number> {
  priceUsd: number;
  timestamp: number;
}

interface GasNowResponse {
  code: number;
  data: GasNowData;
}

export async function gasNow(level: Level): Promise<BigNumber> {
  const result: GasNowResponse = await fetchJson(
    'https://etherchain.org/api/gasnow'
  );
  console.log(result);
  return BigNumber.from(result.data[level]);
}

export function dynamicGetGasPrice(level: Level): () => Promise<BigNumber> {
  return () => gasNow(level);
}
