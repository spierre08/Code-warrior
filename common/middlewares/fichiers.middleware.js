import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.slice(file.originalname.lastIndexOf("."));
    const uniqueName = uuidv4() + ext;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    ".jpg",
    ".jpeg",
    ".png",
    ".pdf",
    ".docx",
    ".csv",
    ".mp4",
  ];
  const ext = file.originalname.slice(file.originalname.lastIndexOf("."));
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Type de fichier non autorisé"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 400 * 1024 * 1024,
  },
});

export default upload;
