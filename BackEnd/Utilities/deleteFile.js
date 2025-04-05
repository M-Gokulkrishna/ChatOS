const fs = require('fs');
const path = require('path');
// 
const deleteFile = async (FolderName, FileName) => {
    const FilePath = path.join(__dirname, "..", "Uploads", FolderName, FileName);
    try {
        await new Promise(async(resolve) => {
            resolve(fs.unlinkSync(FilePath));
        });
    } catch (error) {
        if(error) {
            return "Error while Deleting File!";
        }
    }
}
// 
module.exports = { deleteFile };