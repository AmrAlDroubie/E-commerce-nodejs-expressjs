import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "./server/uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "_" +
        path
          .basename(file.originalname, path.extname(file.originalname))
          .replaceAll(" ", "_") +
        "_" +
        Date.now().toString() +
        path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });
export default upload;
