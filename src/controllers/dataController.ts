import { Request, Response } from "express";
import fs from "fs";
import { exec } from "child_process";
import path from "path";
import {db} from "../config/firebase"

export const getData = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10; // default limit is 10
  const page = parseInt(req.query.page as string) || 1; // default page is 1

  const data = await db.collection("databaseDataRaw")
    .limit(limit)
    .offset((page - 1) * limit)
    .get();

  const dataRaw = data.docs.map((doc) => doc.data());

  res.json(dataRaw);
};
