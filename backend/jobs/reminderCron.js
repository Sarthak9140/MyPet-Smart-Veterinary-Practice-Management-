const cron = require('node-cron');
const Vaccination = require('../models/Vaccination');
const Notification = require('../models/Notification');

const checkVaccinationReminders = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const vaccinations = await Vaccination.find({})
      .populate('petId', 'petName petType ownerId')
      .populate('ownerId', 'name phone email');

    for (const record of vaccinations) {
      if (!record.nextVaccinationDate || !record.petId) continue;

      const nextDate = new Date(record.nextVaccinationDate);
      nextDate.setHours(0, 0, 0, 0);

      const diffTime = nextDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let type = null;
      let title = '';
      let message = '';

      const petName = record.petId.petName;
      const vaccineName = record.vaccineName;

      if (diffDays === 2) {
        type = 'REMINDER_2_DAYS';
        title = 'Vaccination Reminder (2 Days)';
        message = `Vaccination Reminder: ${petName}'s ${vaccineName} vaccination is due in 2 days.`;
      } else if (diffDays === 1) {
        type = 'REMINDER_1_DAY';
        title = 'Vaccination Reminder (Tomorrow)';
        message = `Vaccination Reminder: ${petName}'s ${vaccineName} vaccination is due tomorrow.`;
      } else if (diffDays === 0) {
        type = 'REMINDER_TODAY';
        title = 'Vaccination Due Today';
        message = `Vaccination Due Today: ${petName} is scheduled for ${vaccineName} vaccination today.`;
      } else if (diffDays < 0) {
        type = 'OVERDUE';
        title = 'Overdue Vaccination';
        message = `Overdue Vaccination: ${petName}'s ${vaccineName} vaccination is ${Math.abs(diffDays)} day(s) overdue.`;
      }

      if (type) {
        const dateStr = today.toISOString().split('T')[0];
        const notificationKey = `${record.doctorId}_${record._id}_${type}_${dateStr}`;

        try {
          await Notification.create({
            doctorId: record.doctorId,
            type,
            title,
            message,
            relatedId: record._id,
            relatedModel: 'Vaccination',
            notificationKey,
            isRead: false
          });
          console.log(`[Cron Reminder] Notification created: "${message}"`);
        } catch (dupErr) {
          // E11000 duplicate key error means notification already generated today
          if (dupErr.code !== 11000) {
            console.error('[Cron Reminder] Error saving notification:', dupErr.message);
          }
        }
      }
    }
  } catch (err) {
    console.error('[Cron Reminder] Scheduler error:', err.message);
  }
};

const startReminderCron = () => {
  // Run every day at 8:00 AM (0 8 * * *) and also immediately once on server startup
  console.log('[Cron Reminder] Initializing vaccination reminder cron job...');
  
  // Run startup check
  checkVaccinationReminders();

  // Schedule daily cron
  cron.schedule('0 8 * * *', () => {
    console.log('[Cron Reminder] Running scheduled daily vaccination check...');
    checkVaccinationReminders();
  });
};

module.exports = { startReminderCron, checkVaccinationReminders };
