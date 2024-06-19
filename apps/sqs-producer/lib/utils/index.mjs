import { v4 } from 'uuid';

/**
 * @function
 * @return {String}
* */
export function UID() {
    var arr = new Array(16);

    v4(null, arr, 0);
    var uuid_base64 = Buffer.from(arr).toString('base64');
    return uuid_base64
        .substr(0, uuid_base64.length - 2)
        .replace(/\+/g, '_')
        .replace(/\//g, '-');
}

/**
 * @function
 * @param {Number} val - delay value in milliseconds
 * @return {Promise<null>}
* */
export async function delay(val) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(null);
        }, val);
    });
}
