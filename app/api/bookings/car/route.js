import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


function generateBookingNumber(type = 'CAR') {
    const prefix = type.substring(0, 3).toUpperCase();
    const date = new Date();
    const dateStr = `${date.getFullYear().toString().substring(2)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${dateStr}-${random}`;
}



export async function POST(req) {
    try {
        let userId = null;
        let token = null;

        // Extract token from cookie or header (if provided, this is a public form, but we want to know if it's a logged in user)
        const cookieToken = req.cookies.get('auth-token')?.value;
        const authHeader = req.headers.get('authorization');
        
        if (cookieToken) {
            token = cookieToken;
        } else if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (token) {
             const decoded = verifyToken(token)
             if (decoded && decoded.userId) {
                 userId = decoded.userId
             }
        }

        const data = await req.json();
        const {
            carId,
            startDate,
            endDate,
            numberOfPeople,
            customerName,
            customerEmail,
            customerPhone,
            specialRequests,
            notes
        } = data;

        // Validate required fields
        if (!carId || !startDate || !endDate || !customerName || !customerEmail || !customerPhone) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Fetch car for pricing calculation
        const car = await prisma.car.findUnique({
            where: { id: carId }
        });

        if (!car) {
            return NextResponse.json(
                { error: 'Car not found' },
                { status: 404 }
            );
        }

        // Calculate total price based on days
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Ensure end date is after start date
        if (end <= start) {
            return NextResponse.json(
                { error: 'End date must be after start date' },
                { status: 400 }
            );
        }

        // Calculate difference in days (at least 1 day)
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

        const pricePerDay = car.discount ? car.pricePerDay - car.discount : car.pricePerDay;
        const totalPrice = diffDays * pricePerDay;

        const booking = await prisma.booking.create({
            data: {
                bookingNumber: generateBookingNumber('CAR'),
                userId: userId, // can be null for guest bookings
                carId,
                bookingType: 'CAR',
                startDate: start,
                endDate: end,
                numberOfPeople: parseInt(numberOfPeople) || 1,
                totalPrice,
                status: 'PENDING',
                customerName,
                customerEmail,
                customerPhone,
                specialRequests,
                notes,
            },
        });

        // Optionally: Increment car booking count if we track that (we don't have bookingsCount in Car schema directly, but it's an idea)

        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        console.error('Car booking error:', error);
        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        );
    }
}
