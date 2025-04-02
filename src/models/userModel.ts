import { Schema, models, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
	name: string;
	email: string;
	password: string;
};

const UserSchema = new Schema<IUser> ({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
}, { timestamps: true });

UserSchema.pre<IUser>("save", async function(next) {
	if(!this.isModified("password")) return next();

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
})

UserSchema.methods.comparePasswords = async function(passwordEntry: string) {
	return await bcrypt.compare(passwordEntry, this.password);
};

const User = models.User || model<IUser>("User", UserSchema);

export default User;
