import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SlotData {
  startAt: Date;
  endAt: Date;
}

export class SlotService {
  static async generateSlotsForWeek(startDate: Date): Promise<void> {
    const slots: SlotData[] = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    const slotDuration = 30; // 30 minutes

    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + day);

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += slotDuration) {
          const startAt = new Date(currentDate);
          startAt.setHours(hour, minute, 0, 0);

          const endAt = new Date(startAt);
          endAt.setMinutes(endAt.getMinutes() + slotDuration);

          slots.push({
            startAt,
            endAt
          });
        }
      }
    }

    // Create slots (SQLite doesn't support complex unique constraints)
    await Promise.all(slots.map(async (slot: SlotData) => {
      try {
        await prisma.slot.create({
          data: {
            startAt: slot.startAt,
            endAt: slot.endAt
          }
        });
      } catch (error: any) {
        // Slot might already exist, continue
        console.log('Slot already exists, skipping...');
      }
    }));
  }

  static async getAvailableSlots(fromDate: string, toDate: string) {
    const from = new Date(fromDate + 'T00:00:00Z');
    const to = new Date(toDate + 'T23:59:59Z');

    const slots = await prisma.slot.findMany({
      where: {
        startAt: {
          gte: from,
          lte: to
        }
      },
      include: {
        booking: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        startAt: 'asc'
      }
    });

    return slots.map(slot => ({
      id: slot.id,
      startAt: slot.startAt.toISOString(),
      endAt: slot.endAt.toISOString(),
      isBooked: !!slot.booking,
      bookedBy: slot.booking ? {
        id: slot.booking.user.id,
        name: slot.booking.user.name,
        email: slot.booking.user.email
      } : undefined
    }));
  }
} 