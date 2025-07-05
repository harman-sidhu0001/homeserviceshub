import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

// S3 Client configuration
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Debug S3 configuration
console.log("S3 Configuration:");
console.log("Region:", process.env.AWS_REGION || "eu-north-1");
console.log(
  "Access Key ID:",
  process.env.AWS_ACCESS_KEY_ID ? "Set" : "Not set"
);
console.log(
  "Secret Access Key:",
  process.env.AWS_SECRET_ACCESS_KEY ? "Set" : "Not set"
);

// Check if S3 is properly configured
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.warn("⚠️  AWS credentials not found. S3 uploads will fail.");
  console.warn(
    "Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env file"
  );
}

// Base multer configuration
const createMulterConfig = (folder, maxSize, allowedTypes) => {
  return multer({
    storage: multerS3({
      s3: s3Client,
      bucket: "homeserviceshubbucket",
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {
        cb(null, `${folder}/${Date.now()}_${file.originalname}`);
      },
    }),
    limits: { fileSize: maxSize },
    fileFilter: (req, file, cb) => {
      if (allowedTypes.some((type) => file.mimetype.startsWith(type))) {
        cb(null, true);
      } else {
        cb(
          new Error(`Only ${allowedTypes.join(", ")} files are allowed`),
          false
        );
      }
    },
  });
};

// Pre-configured multer instances
export const uploadProfilePhoto = createMulterConfig(
  "profile-photos",
  10 * 1024 * 1024, // 10MB
  ["image/"]
);

export const uploadVerificationDocs = createMulterConfig(
  "verifydocs",
  50 * 1024 * 1024, // 50MB
  ["image/", "application/pdf"]
);

export const uploadProviderPhoto = createMulterConfig(
  "provider-photos",
  10 * 1024 * 1024, // 10MB
  ["image/"]
);

export const uploadGalleryImage = createMulterConfig(
  "gallery",
  20 * 1024 * 1024, // 20MB
  ["image/"]
);

// Generic upload function
export const createUploadMiddleware = (
  folder,
  maxSize,
  allowedTypes,
  fieldName
) => {
  const multerConfig = createMulterConfig(folder, maxSize, allowedTypes);
  return multerConfig.single(fieldName);
};

// Generic multiple files upload function
export const createMultipleUploadMiddleware = (
  folder,
  maxSize,
  allowedTypes,
  fields
) => {
  const multerConfig = createMulterConfig(folder, maxSize, allowedTypes);
  return multerConfig.fields(fields);
};
