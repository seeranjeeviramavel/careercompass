import File from "../models/fileModel.js";
import { bucket } from "../dbConfig/firebaseConfig.js";

export const uploadFile = async ({
  base64,
  fileName,
  fileType,
  uploadTime,
  checksum,
  uploaderId,
  uploaderType,
  uploadFolder,
}) => {
  if (
    !base64 ||
    !fileName ||
    !fileType ||
    !uploadTime ||
    !checksum ||
    !uploaderId ||
    !uploaderType
  ) {
    throw new Error("All fields are required");
  }

  const buffer = Buffer.from(base64, "base64");
  const uploadPath = `${uploadFolder}/${fileName}`;

  try {
    const fileRef = bucket.file(uploadPath);
    const stream = fileRef.createWriteStream({
      metadata: {
        contentType: fileType,
      },
    });
    stream.end(buffer);

    stream.on("error", (err) => {
      throw new Error("File upload failed: " + err.message);
    });

    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    const [fileUrl] = await fileRef.getSignedUrl({
      action: "read",
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, 
    });

    const newFile = await File.create({
      fileName,
      fileUrl,
      fileSize: buffer.length,
      fileType,
      firebasePath: uploadPath,
      checksum,
      uploadDate: new Date(uploadTime),
      uploaderId,
      uploaderType,
    });

    return newFile;
  } catch (error) {
    throw new Error("File upload failed: " + error.message);
  }
};



export const getFile = async (fileId) => {
  try {
    const file = await File.findById(fileId);
    if (!file) {
      throw new Error("File not found");
    }
    const fileRef = bucket.file(file.firebasePath);
    const [signedUrl] = await fileRef.getSignedUrl({
      action: 'read',
      expires: Date.now() + 24 * 60 * 60 * 1000,
    });

    return {
      fileName: file.fileName,
      fileUrl: signedUrl,
      fileSize: file.fileSize,
      fileType: file.fileType,
      uploadDate: file.uploadDate,
      uploaderId: file.uploaderId,
      uploaderType: file.uploaderType,
    };
  } catch (error) {
    throw new Error("Failed to retrieve file: " + error.message);
  }
};
