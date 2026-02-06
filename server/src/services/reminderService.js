const cron = require('node-cron');
const { Op } = require('sequelize');
const { Todo, User, Notification } = require('../models');
const { sendNotificationToUser } = require('./socketService');
const { sendReminderEmail, sendDueSoonEmail } = require('./emailService');

const checkReminders = async (io) => {
  try {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    // Find todos with reminders due now
    const todosWithReminders = await Todo.findAll({
      where: {
        reminderAt: {
          [Op.between]: [fiveMinutesAgo, fiveMinutesFromNow]
        },
        isCompleted: false
      },
      include: [{ model: User, as: 'user' }]
    });

    for (const todo of todosWithReminders) {
      await createAndSendNotification(io, todo, 'reminder', `Reminder: ${todo.title}`);

      // Clear the reminder after sending
      await todo.update({ reminderAt: null });
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
};

const checkDueSoon = async (io) => {
  try {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    const fiftyFiveMinutesFromNow = new Date(now.getTime() + 55 * 60 * 1000);

    // Find todos due in about 1 hour
    const todosDueSoon = await Todo.findAll({
      where: {
        dueDate: {
          [Op.between]: [fiftyFiveMinutesFromNow, oneHourFromNow]
        },
        isCompleted: false
      },
      include: [{ model: User, as: 'user' }]
    });

    for (const todo of todosDueSoon) {
      // Check if we already sent a due_soon notification
      const existingNotification = await Notification.findOne({
        where: {
          todoId: todo.id,
          type: 'due_soon'
        }
      });

      if (!existingNotification) {
        await createAndSendNotification(io, todo, 'due_soon', `Due soon: ${todo.title}`);
      }
    }
  } catch (error) {
    console.error('Error checking due soon:', error);
  }
};

const checkOverdue = async (io) => {
  try {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    // Find todos that just became overdue
    const overdoeTodos = await Todo.findAll({
      where: {
        dueDate: {
          [Op.between]: [fiveMinutesAgo, now]
        },
        isCompleted: false
      },
      include: [{ model: User, as: 'user' }]
    });

    for (const todo of overdoeTodos) {
      // Check if we already sent an overdue notification
      const existingNotification = await Notification.findOne({
        where: {
          todoId: todo.id,
          type: 'overdue'
        }
      });

      if (!existingNotification) {
        await createAndSendNotification(io, todo, 'overdue', `Overdue: ${todo.title}`);
      }
    }
  } catch (error) {
    console.error('Error checking overdue:', error);
  }
};

const createAndSendNotification = async (io, todo, type, message) => {
  try {
    // Create notification in database
    const notification = await Notification.create({
      userId: todo.userId,
      todoId: todo.id,
      type,
      message
    });

    // Send in-app notification via socket
    sendNotificationToUser(io, todo.userId, {
      id: notification.id,
      type,
      message,
      todoId: todo.id,
      createdAt: notification.created_at
    });

    // Send email notification
    try {
      if (type === 'reminder') {
        await sendReminderEmail(todo.user, todo);
      } else if (type === 'due_soon') {
        await sendDueSoonEmail(todo.user, todo);
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
    }
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

const startReminderJob = (io) => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    console.log('Running reminder check...');
    await checkReminders(io);
    await checkDueSoon(io);
    await checkOverdue(io);
  });

  console.log('Reminder job started');
};

module.exports = {
  startReminderJob,
  checkReminders,
  checkDueSoon,
  checkOverdue
};
