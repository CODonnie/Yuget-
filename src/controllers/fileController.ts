import { Request, Response } from "express";
import FileModel from "../models/fileModel";
import path from "path";
import crypto from "crypto";

//@desc - get files(uploaded by specific user or self)
//@route - GET/api/files-get/:id
export const getFiles = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;

    const files = await FileModel.findById(id).populate("uploadedBy", "name");
    if (!files) {
      res.status(404).json({ message: "no file found" });
      console.log(`no files found`);
      return;
    }

    files.uploadedBy.toString() === userId || userRole === "admin"
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
      const files = await FileModel.find({ uploadedBy: userId }).populate(
        "uploadedBy",
        "name"
      );
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

//@desc - delete files(uploaded by specific user or self)
//@route - DELETE/api/file/:id
export const deleteFiles = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;

    const file = await FileModel.findById(id);
    if (!file) {
      console.log("file not found");
      res.status(404).json({ message: "file not found" });
    }

    if (userRole === "admin" || file.uploadedBy.toString() === userId) {
      await file.deleteOne();
      res.status(200).json({ message: "file deleted" });
    }
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
    console.log(`${error}`);
  }
};

//@desc: download a file
//@route: GET/api/files/:id/download
export const downloadFile = async (req: Request, res: Response) => {
  try {
    const file = await FileModel.findById(req.params.id);
    if (!file) {
      res.status(404).json({ message: "no file found" });
      return;
    }

    const filePath = path.join(__dirname, "../../uploads", file.filename);

    res.download(filePath, file.filename, (err) => {
      if (err) {
        console.log("download error", err);
        res.status(500).json({ message: "error downloading file" });
        return;
      }
    });

    file.download = (file.download || 0) + 1;
    await file.save();
  } catch (error) {
    console.log("download error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

//@desc: create a shareable link
//@route: POST/api/create_link/:id
export const generateLink = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = await FileModel.findById(id);
    if (!file) {
      res.status(404).json({ message: "no file found" });
      return;
    }

    if (
      file.uploadedBy.toString() !== (req as any).user?.id &&
      (req as any).user?.role !== "admin"
    ) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    file.shareableLink = crypto.randomBytes(16).toString("hex");
    await file.save();

    res.status(200).json({
      message: "link created",
      link: `${req.protocol}://${req.get("host")}/api/download/file_link/${
        file.shareableLink
      }`,
    });
  } catch (error) {
    console.log("download error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

//@desc: download with shared file link
//@route: GET/api/file_link/:token/download
export const downloadLink = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const file = await FileModel.findOne({ shareableLink: token });
    if (!file) {
      res.status(404).json({ message: "no file found" });
      return;
    }

    const filePath = path.join(__dirname, "../../uploads", file.filename);

    file.download = (file.download || 0) + 1;
    await file.save();
    res.download(filePath, file.filename, async (err) => {
      if (err) {
        console.log(`download err: ${err}`);
      }
    });
  } catch (error) {
    console.log(`${error}`);
    res.status(500).json({ message: "internal server error" });
  }
};
