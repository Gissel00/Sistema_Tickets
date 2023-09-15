export const isNullOrUndefined = <T>(value: T):boolean => value === null || value === undefined || typeof value === 'undefined';
export const isNullOrWhitespace = (value: any):boolean => isNullOrUndefined(value) || value?.toString().trim().length === 0;
export const isFullObject = (value: any):boolean => !isNullOrWhitespace(value) && typeof value === 'object' && Object.keys(value).length > 0;
export const hasValue = <T>(value: T[]):boolean => !isNullOrUndefined(value) && value?.length > 0;
export const formatDate = (date: Date):string => new Date(date).toLocaleDateString('es-ES');
export const isFullArray = (value:any) => Array.isArray(value) && value.length > 0 && !isNullOrUndefined(value);
export const isFullObjectAndValue = (value: Object) => isFullObject(value) && !isNullOrUndefined(value) && Object.values(value).length > 0 && Object.values(value).every((v) => !isNullOrWhitespace(v));
export const getDiffInHours = (dateInit: Date, dateEnd: Date):string => {
    const date1 = new Date(dateInit);
    const date2 = new Date(dateEnd);
    const diff = Math.abs(date2.getTime() - date1.getTime());
    return (diff / (1000 * 3600)).toFixed(2);
};
export * from '../helpers/index';