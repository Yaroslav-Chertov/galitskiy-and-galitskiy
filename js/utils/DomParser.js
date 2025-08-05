const DomParser = new DOMParser();
const parseDOMString = (str) => DomParser.parseFromString(str, 'text/html');
const parseSvgString = (str) => DomParser.parseFromString(str, 'image/svg+xml');

export {
    parseDOMString,
    parseSvgString
}