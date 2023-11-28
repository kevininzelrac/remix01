import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "kevin@prisma.io" },
    update: {},
    create: {
      email: "kevin@prisma.io",
      fullName: "Kevin The Dude",
      firstname: "Kevin",
      lastname: "The Dude",
      avatar:
        "https://fastly.picsum.photos/id/962/200/200.jpg?hmac=XehF7z9JYkgC-2ZfSP05h7eyumIq9wNKUDoCLklIhr4",
      Credential: {
        create: {
          passwordHash:
            "$2a$10$evty0xZrO8I5pJ5HpBPWKelvbigrb5LWG4D3U1xShRRI.rjB03u6y",
        },
      },
    },
  });
  await prisma.user.upsert({
    where: { email: "sebastian@prisma.io" },
    update: {},
    create: {
      email: "sebastian@prisma.io",
      fullName: "Sebastian eL Patron",
      firstname: "Sebastian",
      lastname: "El Patron",
      avatar:
        "https://fastly.picsum.photos/id/249/200/200.jpg?hmac=75zqoHvrxGGVnJnS8h0gUzZ3zniIk6PggG38GjmyOto",
      Credential: {
        create: {
          passwordHash:
            "$2a$10$evty0xZrO8I5pJ5HpBPWKelvbigrb5LWG4D3U1xShRRI.rjB03u6y",
        },
      },
    },
  });

  const authorId = async (email: string) => {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });
    if (!user) throw new Error("Can't find authorId");
    return user.id;
  };

  await prisma.post.createMany({
    data: [
      {
        title: "Introduction to JavaScript",
        content: "Lorem ipsum...",
        category: "Technology",
        authorId: await authorId("kevin@prisma.io"),
        createdAt: new Date("2023-01-01T10:00:00"),
      },
      {
        title: "The wonders of the universe",
        content: "Lorem ipsum...",
        category: "Science",
        authorId: await authorId("sebastian@prisma.io"),
        createdAt: new Date("2023-02-15T14:30:00"),
      },
      {
        title: "Exploring new places",
        content: "Lorem ipsum...",
        category: "Travel",
        authorId: await authorId("sebastian@prisma.io"),
        createdAt: new Date("2023-03-10T08:45:00"),
      },
      {
        title: "Cooking adventures",
        authorId: await authorId("kevin@prisma.io"),
        category: "Food",
        content: "Lorem ipsum...",
        createdAt: new Date("2023-04-05T18:20:00"),
      },
      {
        title: "Staying fit and healthy",
        content: "Lorem ipsum...",
        category: "Health",
        authorId: await authorId("sebastian@prisma.io"),
        createdAt: new Date("2023-05-20T12:15:00"),
      },
      {
        title: "The power of music",
        content: "Lorem ipsum...",
        category: "Music",
        authorId: await authorId("kevin@prisma.io"),
        createdAt: new Date("2023-06-30T22:00:00"),
      },
      {
        title: "Thrilling sports moments",
        content: "Lorem ipsum...",
        category: "Sports",
        authorId: await authorId("sebastian@prisma.io"),
        createdAt: new Date("2023-07-12T16:10:00"),
      },
      {
        title: "Fashion trends of the season",
        content: "Lorem ipsum...",
        category: "Fashion",
        authorId: await authorId("sebastian@prisma.io"),
        createdAt: new Date("2023-08-25T09:30:00"),
      },
      {
        title: "Exploring the world of art",
        content: "Lorem ipsum...",
        category: "Art",
        authorId: await authorId("kevin@prisma.io"),
        createdAt: new Date("2023-09-18T17:45:00"),
      },
      {
        title: "Connecting with nature",
        content: "Lorem ipsum...",
        category: "Nature",
        authorId: await authorId("sebastian@prisma.io"),
        createdAt: new Date("2023-10-05T11:55:00"),
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
