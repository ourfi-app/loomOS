/**
 * Mock Server Integration for Testing
 */

export const serverNotifications = {
  notifyMessageReceived: jest.fn(),
  notifyTaskAssigned: jest.fn(),
  notifyEventCreated: jest.fn(),
};

export const logIntegrationEvent = jest.fn();
