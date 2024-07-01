import multer from 'multer';
import path from 'path';

const __dirname = path.resolve();

const storage = multer.diskStorage({

  destination: (req, file, cb) => { cb(null, "Backend/Public/Posts") },

  filename: (req, file, cb) => { cb( null, file.fieldname + "_" + Date.now() + path.extname(file.originalname) ) }
  
});



const PostUpload = multer({
  storage: storage
});

export default PostUpload
