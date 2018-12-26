/**
 * Returns a string of the nested path (in relation to the top-level observed object)
 * of the property being modified or deleted.
 * @param target the object whose property is being modified or deleted.
 * @param property the string name of the property
 * @param path
 * @param [jsonPointer] optional, set to true if the string path should be formatted as a JSON pointer.
 * @returns {string} String of the nested path (e.g., hello.testing.1.bar or, if JSON pointer, /hello/testing/1/bar
 */
function getPath(target, property, path, jsonPointer) {

    let fullPath = '';
    let lastTarget = null;

    // loop over each item in the path and append it to full path
    for (let i = 0; i < path.length; i++) {

        // if the current object was a member of an array, it's possible that the array was at one point
        // mutated and would cause the position of the current object in that array to change. we perform an indexOf
        // lookup here to determine the current position of that object in the array before we add it to fullPath
        if (lastTarget instanceof Array && !isNaN(path[i].property)) {
            path[i].property = lastTarget.indexOf(path[i].target);
        }

        fullPath = fullPath + '.' + path[i].property;
        lastTarget = path[i].target;
    }

    // add the current property
    fullPath = fullPath + '.' + property;

    // remove the beginning two dots -- ..foo.bar becomes foo.bar (the first item in the nested chain doesn't have a property name)
    fullPath = fullPath.substring(2);

    if (jsonPointer === true) fullPath = '/' + fullPath.replace(/\./g, '/');

    return fullPath;
}

module.exports = getPath;