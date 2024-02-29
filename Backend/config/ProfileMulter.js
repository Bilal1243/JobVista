import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../Public/Profiles'));
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9) + path.extname(file.originalname));
  }
});

const ProfileUpload = multer({
  storage: storage
});

export default ProfileUpload;
