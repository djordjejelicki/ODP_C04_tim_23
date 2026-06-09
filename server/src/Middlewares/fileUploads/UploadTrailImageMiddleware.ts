import multer from "multer";
import path from "node:path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/trails/");
    },

    filename: (req, file, cb) => {
        const uniqueSuffix = 
            Date.now() + "-" + Math.round(Math.random() * 1e9);
        
        const extensions = path.extname(file.originalname);

        cb(null, `trail-${uniqueSuffix}${extensions}`);
    },
});

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (allowedMimeTypes.includes(file.mimetype)){
        cb(null, true);
    } else{
        cb(new Error("Only images are allowed")); 
    }
};

export const uploadTrailImage = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});