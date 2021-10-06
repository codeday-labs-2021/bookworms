/**
 * A function that processes which filtering or sorting the user wants
 * @param query object with details for url
 * @return part of url
 * 
 */

const getQuery = (query) => {
    const ret = [];
    for (const k in query) {
      if ((query[k]).length !== 0) {
        ret.push(`${k}=${query[k]}`);
      } else {
        return "";
      }
    }
    return ret.join('&');
}
export default getQuery;