import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const url = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Gaji", type: "income" },
  { name: "Freelance", type: "income" },
  { name: "Investasi", type: "income" },
  { name: "Hadiah", type: "income" },
  { name: "Makanan", type: "expense" },
  { name: "Transport", type: "expense" },
  { name: "Belanja", type: "expense" },
  { name: "Hiburan", type: "expense" },
  { name: "Tagihan", type: "expense" },
  { name: "Kesehatan", type: "expense" },
  { name: "Pendidikan", type: "expense" },
  { name: "Lainnya", type: "both" },
];

async function main() {
  const existing = await prisma.category.findMany();
  const existingNames = new Set(existing.map((c) => c.name));
  const newCategories = categories.filter((c) => !existingNames.has(c.name));
  if (newCategories.length > 0) {
    await prisma.category.createMany({ data: newCategories });
    console.log(`Seed: ${newCategories.length} categories inserted.`);
  } else {
    console.log("Seed: all categories already exist.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
