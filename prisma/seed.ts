import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: {
      name: 'Coddee Co',
      email: 'coddee.co@gmail.com',
      memberIn: {
        create: {
          role: 'OWNER',
          organization: {
            create: {
              name: "Coddee Co's Org",
              type: 'PERSONAL',
            },
          },
        },
      },
    },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)

    await prisma.$disconnect()

    process.exit(1)
  })
