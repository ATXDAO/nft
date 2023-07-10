import { BigNumber } from 'ethers';
import { fetchJson } from 'ethers/lib/utils';

export type GasPriority = 'slow' | 'standard' | 'fast' | 'rapid';

interface GasNowData extends Record<GasPriority, number> {
  priceUsd: number;
  timestamp: number;
}

interface GasNowResponse {
  code: number;
  data: GasNowData;
}

export async function gasNow(): Promise<GasNowData> {
  const result: GasNowResponse = await fetchJson(
    'https://etherchain.org/api/gasnow'
  );
  return result.data;
}

export async function getGasPrice(priority: GasPriority): Promise<BigNumber> {
  const gasNowData = await gasNow();
  return BigNumber.from(gasNowData[priority]);
}

export function dynamicGetGasPrice(
  priority: GasPriority
): () => Promise<BigNumber> {
  return () => getGasPrice(priority);
}
