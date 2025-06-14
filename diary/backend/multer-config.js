const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const uploadsDir = path.resolve(__dirname, 'uploads');
const avatarsDir = path.resolve(uploadsDir, 'avatars');

const initDirectories = async () => {
    try {
        await fs.mkdir(uploadsDir, { recursive: true });
        await fs.mkdir(avatarsDir, { recursive: true });
        console.log('Upload directories created');
    } catch (err) {
        console.error('Error creating upload directories:', err);
    }
};

initDirectories();

const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, avatarsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `avatar-${uniqueSuffix}${ext}`);
    }
});

const uploadAvatar = multer({
    storage: avatarStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'), false);
        }
    }
});

module.exports = { uploadAvatar };
