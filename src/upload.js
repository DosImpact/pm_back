import multer from "multer";
import path from "path";

export const uploadMiddleware = multer({
  dest: "upload/",
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/");
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(
        null,
        path.basename(file.originalname, ext) + new Date().valueOf() + ext
      );
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("file");

export const uploadContoller = (req, res) => {
  console.log("upload::", req.file, req.body); // 보통은 body인데
  const { file } = req;
  console.log(file);
  res.json({ url: `/${req.file.filename}` });
  res.end();
};
