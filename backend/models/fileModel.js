import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileSize: { type: Number, required: true },
  fileType: { type: String, required: true },
  firebasePath: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  uploaderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  uploaderType: {
    type: String,
    required: true,
    enum: ["user", "company"],
  },
  checksum: { type: String, required: true },
});

const Files = mongoose.model("Files", fileSchema);

export default Files;