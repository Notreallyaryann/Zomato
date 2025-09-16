const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadFile = async (file, fileName) => {
    try {
        
        const base64File = file.toString("base64");

        const result = await imagekit.upload({
            file: base64File,
            fileName: fileName,
        });

        return result;
    } catch (error) {
        console.error("ImageKit Upload Error:", error);
        throw error;
    }
};

module.exports = { uploadFile };

