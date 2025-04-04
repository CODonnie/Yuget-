import mongoose, { Schema, models, model, Document, ObjectId } from "mongoose";

interface IFile extends Document {
	filename: string,
	fileUrl: string,
	mimetype: string,
	size: number,
	uploadedBy: ObjectId,
	createdAt: Date,
};

const FileSchema = new Schema<IFile>({
	filename: {type: String, required: true},
	fileUrl: {type: String, required: true},
	mimetype: {type: String, required: true},
	size: {type: Number, required: true},
	uploadedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
	createdAt: {type: Date, default: Date.now, expires: "7d"}
});

const FileModel = models.File || model<IFile>("File", FileSchema);

export default FileModel;
