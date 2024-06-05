const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    //console.log(file);
    const split = file.originalname.split(".");
    cb(
      null,
      "" +
        Date.now() +
        Math.round(Math.random() * 100) +
        "." +
        split[split.length - 1]
    ); //  mimetype: 'image/jpeg' ตัวสุดท้าย
  },
});

const upload = multer({ storage: storage });
module.exports = upload;

//  file จะให้เก็บ file ตรงไหน
//  cb Error file ไม่ถูก req หน้าบ้าน ไม่ต้องการโชว์Error   cb(null);
//  originalname: 'q.jpg', array spilt ออก เพื่อเอา เฉพาะสกุล
//  file.originalname.split(".") จะให้ค่า ["q", "jpg"]
//  split[split.length - 1] จะให้ค่า "jpg"
// รวม 1716396809833+.+สกุลไฟล์ = "1716396809833"

// https://console.cloudinary.com/ ส่ง file เข้าไปเก็บ แทนที่จะเก็บใน คอม
// pnpm add cloudinary
