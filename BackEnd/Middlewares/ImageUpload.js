const multer = require('multer');
const path = require('path');
// Multer Storage Instance
const storageInstance = multer.diskStorage({
    destination: "./Uploads/ProfileImages",
    filename: (request, file, cb) => {
        const DateInstance = new Date();
        const currentDate = DateInstance.getDate().toString().padStart(2, 0) + "-" + (DateInstance.getMonth() + 1).toString().padStart(2, 0) + "-" + DateInstance.getFullYear();
        const currentTime = (DateInstance.getHours() % 12 || 12).toString().padStart(2, 0) + "-" + DateInstance.getMinutes().toString().padStart(2, 0) + "-" + DateInstance.getSeconds().toString().padStart(2, 0) + "-" + DateInstance.getMilliseconds().toString().padStart(4, 0);
        cb(null, "ProfileImage-" + currentDate + "-" +currentTime + path.extname(file.originalname));
    }
});
// Multer Config
const ProfileImageUpload = multer({
    storage: storageInstance,
    limits: {
        fileSize: (1024 * 1024 * 10)
    }
}).single("ProfileImage");
// 
module.exports = { ProfileImageUpload };