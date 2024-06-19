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
