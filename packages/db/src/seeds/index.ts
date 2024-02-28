import { PrismaClient } from "@prisma/client";
import { WizardStep } from "@app/utils/constants";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "kevin@prisma.io" },
    update: {},
    create: {
      email: "kevin@prisma.io",
      emailVerifiedAt: new Date(),
      fullName: "Kevin The Dude",
      avatar:
        "https://fastly.picsum.photos/id/962/200/200.jpg?hmac=XehF7z9JYkgC-2ZfSP05h7eyumIq9wNKUDoCLklIhr4",
      credential: {
        create: {
          passwordHash:
            "$2a$10$evty0xZrO8I5pJ5HpBPWKelvbigrb5LWG4D3U1xShRRI.rjB03u6y",
        },
      },
      wizardStep: WizardStep.INITIAL,
    },
  });
  await prisma.user.upsert({
    where: { email: "sebastian@prisma.io" },
    update: {},
    create: {
      email: "sebastian@prisma.io",
      emailVerifiedAt: new Date(),
      fullName: "Sebastian El Patron",
      avatar:
        "https://fastly.picsum.photos/id/249/200/200.jpg?hmac=75zqoHvrxGGVnJnS8h0gUzZ3zniIk6PggG38GjmyOto",
      credential: {
        create: {
          passwordHash:
            "$2a$10$evty0xZrO8I5pJ5HpBPWKelvbigrb5LWG4D3U1xShRRI.rjB03u6y",
        },
      },
      wizardStep: WizardStep.INITIAL,
    },
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
