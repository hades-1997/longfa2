import multer from 'multer';
import path from 'path';

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(process.cwd(), 'src/public', 'uploads'));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.mimetype === 'application/vnd.ms-excel') {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file Excel!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

export default upload; 