import { readFileSync } from 'fs';

export type ContractName = 'ATXDAONFT' | 'ATXDAONFT_V2';

export function getContractAddress(
  contractName: ContractName,
  networkName: string
): string {
  const fileName = `deployments/${networkName}/${contractName}.json`;
  return JSON.parse(readFileSync(fileName).toString()).address;
}
