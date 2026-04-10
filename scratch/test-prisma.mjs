
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Testing Prisma connection...')
  try {
    const gifts = await prisma.gift.findMany()
    console.log('Success! Found gifts:', gifts.length)
  } catch (error) {
    console.error('Prisma Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
