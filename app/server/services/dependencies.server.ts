import { createTransport } from "nodemailer";
import { PrismaClient } from "@prisma/client";
import { readReplicas } from "@prisma/extension-read-replicas";

import { GMAIL_SECRET, GMAIL_USER, READ_DB_URL } from "../constants.server";

export const prisma = new PrismaClient().$extends(
  readReplicas({
    url: READ_DB_URL,
  }),
) as any as PrismaClient;

export const transport = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_SECRET,
  },
});
