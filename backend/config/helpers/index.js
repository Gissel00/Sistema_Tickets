function isNullOrUndefined(value){
  return  value === null || value === undefined || typeof value === 'undefined';
}
function isNullOrWhitespace(value){
  return isNullOrUndefined(value) || value?.toString().trim().length === 0;
} 

function getDiffInHours (dateInit, dateEnd) {
  const date1 = new Date(dateInit);
  const date2 = new Date(dateEnd);
  const diff = Math.abs(date2.getTime() - date1.getTime());
  return (diff / (1000 * 3600)).toFixed(2);
};

function formateDateShort(date) {
  const dateObj = new Date(date);
  const output = dateObj.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit'});
  return output;
}

function groupBy(objectArray, property) {
  return objectArray.reduce(function (acc, obj) {
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}

function isObject(value) {
  return (
    !isNullOrUndefined(value) &&
    typeof value === 'object' &&
    Object.keys(value).length > 0
  );
}

module.exports = {
  isNullOrWhitespace,
  getDiffInHours,
  isNullOrUndefined,
  formateDateShort,
  groupBy,
  isObject,
};