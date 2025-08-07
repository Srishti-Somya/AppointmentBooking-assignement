import { PrismaClient } from '@prisma/client';
import { BookingResponse } from '../types';

const prisma = new PrismaClient();

export class BookingService {
  static async createBooking(userId: string, slotId: string): Promise<BookingResponse> {
    return await prisma.$transaction(async (tx) => {
      // Check if slot exists and is not already booked
      const slot = await tx.slot.findUnique({
        where: { id: slotId },
        include: { booking: true }
      });

      if (!slot) {
        throw new Error('Slot not found');
      }

      if (slot.booking) {
        throw new Error('Slot is already booked');
      }

      // Create the booking
      const booking = await tx.booking.create({
        data: {
          userId,
          slotId
        },
        include: {
          slot: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      return {
        id: booking.id,
        slot: {
          id: booking.slot.id,
          startAt: booking.slot.startAt.toISOString(),
          endAt: booking.slot.endAt.toISOString()
        },
        user: {
          id: booking.user.id,
          name: booking.user.name,
          email: booking.user.email
        },
        createdAt: booking.createdAt.toISOString()
      };
    });
  }

  static async getUserBookings(userId: string): Promise<BookingResponse[]> {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        slot: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return bookings.map(booking => ({
      id: booking.id,
      slot: {
        id: booking.slot.id,
        startAt: booking.slot.startAt.toISOString(),
        endAt: booking.slot.endAt.toISOString()
      },
      user: {
        id: booking.user.id,
        name: booking.user.name,
        email: booking.user.email
      },
      createdAt: booking.createdAt.toISOString()
    }));
  }

  static async getAllBookings(): Promise<BookingResponse[]> {
    const bookings = await prisma.booking.findMany({
      include: {
        slot: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return bookings.map(booking => ({
      id: booking.id,
      slot: {
        id: booking.slot.id,
        startAt: booking.slot.startAt.toISOString(),
        endAt: booking.slot.endAt.toISOString()
      },
      user: {
        id: booking.user.id,
        name: booking.user.name,
        email: booking.user.email
      },
      createdAt: booking.createdAt.toISOString()
    }));
  }
} 