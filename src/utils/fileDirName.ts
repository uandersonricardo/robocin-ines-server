import { fileURLToPath } from 'url';
import { dirname } from 'path';

const fileDirName = (url: string) => {
  const __filename = fileURLToPath(url);
  const __dirname = dirname(__filename);

  return { __dirname, __filename };
}

export default fileDirName;
