/**
 * String sanitization
 * @param str
 * @returns {string}
 */
function sanitize(str) {
    return typeof str === 'string'
        ? str
            .replace(/&(?!\w+;)/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/'/g, '&quot;')
        : str;
}

module.exports = sanitize;