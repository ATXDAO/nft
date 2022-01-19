import { DeploymentsExtension } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

interface HREExtended extends HardhatRuntimeEnvironment {
  deployments: DeploymentsExtension;
}

export interface FixedDeployFunction {
  (env: HREExtended): Promise<void | boolean>;
  skip?: (env: HREExtended) => Promise<boolean>;
  tags?: string[];
  dependencies?: string[];
  runAtTheEnd?: boolean;
  id?: string;
}
