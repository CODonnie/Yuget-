import mongoose, { Schema, models, model, Document, ObjectId } from "mongoose";

interface IFile extends Document {
  filename: string;
  fileUrl: string;
  mimetype: string;
  size: number;
  shareableLink: string;
  download: number;
  uploadedBy: ObjectId;
  createdAt: Date;
}

const FileSchema = new Schema<IFile>({
  filename: { type: String, required: true },
  fileUrl: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  shareableLink: { type: String, unique: true, sparse: true },
  download: { type: Number, default: 0 },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now, expires: "7d" },
});

const FileModel = models.File || model<IFile>("File", FileSchema);

export default FileModel;
