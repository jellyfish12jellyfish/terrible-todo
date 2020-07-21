const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'images');
    },
    filename(req, file, cb) {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (req, file, cb) => {

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

module.exports = multer({
    // storage: storage,
    //названия ключа и значений совпадают, можно написать короче, вместо: storage:storage -- storage
    storage,
    //то же самое
    fileFilter
});