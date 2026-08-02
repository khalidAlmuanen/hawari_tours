import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function addReview() {
  try {
    // Get existing user and tour
    const user = await prisma.user.findFirst({ where: { email: 'customer1@example.com' } });
    const tour = await prisma.tour.findFirst({ where: { slug: 'dragon-blood-trees-tour' } });
    
    if (!user || !tour) {
      console.log('❌ User or tour not found');
      return;
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        tourId: tour.id,
        rating: 5,
        title: 'Amazing Dragon Blood Trees Experience!',
        comment: 'The tour was absolutely incredible! Our guide was very knowledgeable. Highly recommend this tour to anyone visiting Socotra!'
      }
    });
    
    console.log('✅ Review created successfully!');
    console.log(`📝 Review ID: ${review.id}`);
    
  } catch (error) {
    console.error('❌ Error creating review:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addReview();
