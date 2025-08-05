import { readFile } from 'node:fs/promises';
import { saveFile } from '../utils/fs.js';
import path from 'node:path';
import staticData from './staticData.js';

const cacheResponse = process.env.CACHE_API_RESPONSE === 'true';
const getData = async (url) => {

    return staticData;
    // TODO: обработка ошибок от АПИ
    const reqUrl = process.env.API_URL ? `${process.env.API_URL}${url}` : false;
    console.log('url', url);
    if (cacheResponse) {
        try {
            const data = await readFile(path.join('./.cache', url, 'data.json'));
            return JSON.parse(data);
        } catch (error) {
            // console.log('No cache. Continue', error);
        }
    }

    console.log('Get data from API', process.env.API_URL);

    let response = {};
    if (reqUrl) {
        response = await fetch(reqUrl)
        .then(async r => {
            if (!r.ok) return false
            return r.json()
        })
        .catch(e => {
            console.log('Error on getting data', e)
            return false;
        });
    }

    if (cacheResponse) {
        await saveFile(path.resolve('./.cache/', url), 'data.json', JSON.stringify(response, null, 4))
        return response;
    }

    return response;
}

export {
    getData
}