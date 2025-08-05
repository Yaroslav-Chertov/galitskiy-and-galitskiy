import fs from 'node:fs/promises';
import path from 'node:path';

const saveFile = async (dir, name, data) => {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), data, 'utf-8');
}

export {
    saveFile
};