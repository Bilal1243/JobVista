import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../Public/Posts'));
  },
  filename: (req, file, cb) => { cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname)) }

});



const PostUpload = multer({
  storage: storage
});

export default PostUpload