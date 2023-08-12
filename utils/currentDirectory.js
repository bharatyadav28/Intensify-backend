import path from "path";
import url from "url";

const getCurrentDirectory = (metaUrl) => {
  // import.meta.url
  const __filename = url.fileURLToPath(metaUrl);
  const __dirname = path.dirname(__filename);
  return __dirname;
};
export default getCurrentDirectory;
