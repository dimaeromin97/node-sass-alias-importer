const path = require("path");

const aliasImporter = (aliases, options = {}) => {
  const aliasesDetails = Object.keys(aliases).map(alias => ({
    alias,
    path: path.resolve(options.root || process.cwd(), aliases[alias])
  }));
  return (url, prev, done) => {
    let aliasFound = false;
    aliasesDetails.forEach(aliasDetails => {
      var separator = new RegExp( path.sep + '|/'.replace( "\\", "\\\\" ), "g" );
      if (!aliasFound && url.split(separator)[0] === aliasDetails.alias) {
        aliasFound = true;
        done({
          file: url.replace(
            aliasDetails.alias,
            path.relative(prev, aliasDetails.path).replace(`..${separator}`, "")
          )
        });
      }
    });
    if (!aliasFound) {
      done({
        file: url
      });
    }
  };
};

module.exports = aliasImporter;
