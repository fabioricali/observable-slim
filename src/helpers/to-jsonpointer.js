/**
 * Convert JSON dotted to JSONPointer path
 * @param path
 * @returns {string} String of the nested path (e.g., hello.testing.1.bar or, if JSON pointer, /hello/testing/1/bar
 */
function toJSONPath(path) {

    path = '/' + path.replace(/\./g, '/');

    return path;
}

module.exports = toJSONPath;