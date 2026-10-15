import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "Cute Teddy",
    slug: "cute-teddy",
    description: "Soft amigurumi teddy, perfect for gifting.",
    pricePaise: 49900,
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    category: "Amigurumi",
    featured: true,
  },
  {
    name: "Sunflower Bouquet",
    slug: "sunflower-bouquet",
    description: "Everlasting crochet sunflowers in a cozy bundle.",
    pricePaise: 79900,
    imageUrl:
      "https://images.unsplash.com/photo-1597848219624-1fb5145f2caa?w=800&q=80",
    category: "Home decor",
    featured: true,
  },
  {
    name: "Crochet Bag",
    slug: "crochet-bag",
    description: "Handmade shoulder bag with a relaxed boho feel.",
    pricePaise: 89900,
    imageUrl:
      "https://images.unsplash.com/photo-1590874103328-eac142a716f9?w=800&q=80",
    category: "Accessories",
    featured: true,
  },
  {
    name: "Keychain",
    slug: "keychain",
    description: "Mini crochet charm for keys or bags.",
    pricePaise: 29900,
    imageUrl:
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80",
    category: "Accessories",
    featured: true,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD ?? "SammyAdmin@2026",
    12,
  );

  await prisma.user.upsert({
    where: { phone: "9959924860" },
    update: {},
    create: {
      phone: "9959924860",
      email: "sammy@crochetbysammy.com",
      passwordHash,
      isAdmin: true,
    },
  });

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
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
