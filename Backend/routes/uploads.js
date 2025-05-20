import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname=  path.dirname(__filename);


const storage= multer.diskStorage({
 destination: (req,file, callback) => {
        return callback(null, path.join(__dirname, '../uploads'))
 },
 filename: (req,file,callback) => {
    const timestamps = new Date().toISOString().replace(/:/g, '-')
    return callback(null, timestamps + '-' + file.originalname.replace(/\s+/g, '_'));
 }
})

const upload = multer({storage});

export {upload}

