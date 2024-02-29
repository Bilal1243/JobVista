import multer from 'multer';
import path from 'path';

const __dirname = path.resolve();

console.log(__dirname)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "./Public/Profiles"));
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

const ProfileUpload = multer({
  storage: storage
});

export default ProfileUpload;
