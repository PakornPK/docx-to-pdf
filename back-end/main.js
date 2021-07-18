const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const multer = require("multer");
const upload = multer({ dest: "upload/" });
const libre = require("libreoffice-convert");
const Glob = require("glob");
const moment = require("moment");
const fs = require("fs");

const app = express();
const port = process.env.port || 5000;
const type = upload.array("files", 10);
const extend = ".pdf";

app.use(cors());
app.use(helmet());
app.use(express.json());

app.post("/api/v1/convert", type, function (req, res) {
  const tmp_path = req.files;
  tmp_path.forEach((file) => {
    const pdfFileName = file.originalname.split(".");
    const outputPath = `file/${pdfFileName[0]}.pdf`;
    const fileSystem = fs.readFileSync(file.path);
    libre.convert(fileSystem, extend, undefined, (err, done) => {
      if (err) {
        console.log(`Error converting file: ${err}`);
      }
      fs.writeFileSync(outputPath, done);
    });
  });
  res.status(200).json({ status: "Finish" });
});

app.get("/api/v1/get-file-list", (req, res) => {
  console.log(`${req.method} / ${req.url}`);
  let fileOpj = [];
  const fsStore = Glob.sync("file/*.pdf");
  fsStore.map((item, index) => {
    let stats = fs.statSync(item);
    let filename = item.split("/");
    fileOpj.push({
      Id: index + 1,
      name: `${filename[filename.length - 1]}`,
      datetime: moment(stats.birthtime).format("dddd, MMMM Do YYYY, HH:mm:ss"),
    });
  });
  res.json(fileOpj);
});

app.get("/api/v1/download/:filename", (req, res) => {
  const pathFile = "file/";
  res.download(pathFile + req.params.filename, req.params.filename);
});

app.listen(port, () => {
  console.log(`Server is starting at http://127.0.0.1:${port}`);
});
