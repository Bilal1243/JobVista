import multer from 'multer';
import path from 'path';

const __dirname = path.resolve();


const storage = multer.diskStorage({

  destination: (req, file, cb) => { cb(null, "Backend/Public/Resume") },

  filename: (req, file, cb) => { cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname)) }

});



const ResumeUpload = multer({
  storage: storage
});

export default ResumeUpload