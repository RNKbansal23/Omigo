const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Seeding test data...');
    
    // Create a test product
    const product = await prisma.product.create({
      data: {
        name: 'Premium Chocolate Gift Box',
        description: 'A luxurious assortment of hand-crafted Belgian chocolates.',
        price: 49.99,
        category: 'Chocolates',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80'],
        isActive: true,
      },
    });

    console.log('✅ Test product created successfully:', product.name);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
