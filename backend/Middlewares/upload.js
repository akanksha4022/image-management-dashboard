const multer = require('multer');
const path = require('path');

const fileFilter = (req, file, cb)=>{
  const allowedTypes= /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null, true);
  }else{
    cb(new Error ('Only images are allowed(jpg, jpeg, png)'));
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // folder to store images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

const upload = multer({ 
  storage,
  limits:{fileSize: 5*1024*1024},
  fileFilter
});
module.exports = upload;
