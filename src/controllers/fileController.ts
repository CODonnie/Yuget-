import { Request, Response } from "express";
import FileModel from "../models/fileModel";

//@desc - get files(uploaded by specific user or self)
//@route - GET/api/files-get/:id
export const getFiles = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;

    const files = await FileModel.findById(id);
    if (!files) {
      res.status(404).json({ message: "no file found" });
      console.log(`no files found`);
      return;
    }

    files.uploadedBy === userId || userRole === "admin"
      ? res.status(200).json({ files })
      : res.status(403).json({ message: "admin priviledge required" });
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
    console.log(`${error}`);
  }
};

//@desc - get all files(admin or user files)
//@route - GET/api/all-files-get
export const getAllFiles = async (req: Request, res: Response) => {
  try {
    const userRole = (req as any).user?.role;
    const userId = (req as any).user?.id;

    if (userRole === "admin") {
      const files = await FileModel.find();
      if (!files) {
        res.status(404).json({ message: "no file found" });
        console.log(`no files found`);
        return;
      }

      res.status(200).json({ files });
    } else {
      const files = await FileModel.find({ uploadedBy: userId });
      if (!files) {
        res.status(404).json({ message: "no file found" });
        console.log(`no files found`);
        return;
      }

      res.status(200).json({ files });
    }
	} catch (error) {
		console.log(`${error}`);
		res.status(500).json({ error: "internal server error" });
	}
};
