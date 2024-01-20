"use server";

import { currentUser } from "@clerk/nextjs";
import prisma from '@/lib/prisma';
import { FormSchemaType, formSchema } from "@/schemas/form";

class UserNotFoundErr extends Error {}

export async function getFormStats() {
  const user = await currentUser();
  if (!user) throw new UserNotFoundErr();
  const stats = await prisma.form.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      visits: true,
      submissions: true
    }
  });
  const visits = stats._sum.visits || 0;
  const submissions = stats._sum.submissions || 0;
  let submissionRate = 0;
  if (visits > 0) submissionRate = (submissions / visits) * 100;
  const bounceRate = 100 - submissionRate;
  return {
    visits,
    submissions,
    submissionRate,
    bounceRate
  }
}

export async function getForms() {
  const user = await currentUser();
  if (!user) throw new UserNotFoundErr();
  const forms = await prisma.form.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return forms;
}

export async function createForm(data: FormSchemaType) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) throw new Error("Form not valid");
  const user = await currentUser();
  if (!user) throw new UserNotFoundErr();
  const form = await prisma.form.create({
    data: {
      userId: user.id,
      ...data
    }
  })
  if (!form) throw new Error("Something wnt wrong");
  return form.id;
}

export async function getFormById(id: number) {
  const user = await currentUser();
  if (!user) throw new UserNotFoundErr();
  const forms = await prisma.form.findUnique({
    where: {
      id,
      userId: user.id
    }
  });
  return forms;
}

export async function getFormContentByUrl(url: string) {
  return await prisma.form.update({
    select: {
      content: true
    },
    data: {
      visits: { increment: 1 }
    },
    where: {
      shareUrl: url
    }
  })
}

export async function getFormWithSubmissions(id: number) {
  const user = await currentUser();
  if (!user) throw new UserNotFoundErr();
  return await prisma.form.findUnique({
    include: {
      formSubmissions: true
    },
    where: {
      id,
      userId: user.id
    }
  })
}

export async function saveForm(url: string, content: string) {
  return await prisma.form.update({
    data: {
      submissions: { increment: 1 },
      formSubmissions: {
        create: {
          content
        }
      }
    },
    where: {
      shareUrl: url,
      published: true
    }
  })
}

export async function updateFormContent(id: number, jsonContent: string) {
  const user = await currentUser();
  if (!user) throw new UserNotFoundErr();
  return await prisma.form.update({
    where: {
      userId: user.id,
      id
    },
    data: {
      content: jsonContent
    }
  })
}

export async function publishForm(id: number) {
  const user = await currentUser();
  if (!user) throw new UserNotFoundErr();
  return await prisma.form.update({
    where: {
      userId: user.id,
      id
    },
    data: {
      published: true
    }
  })
}