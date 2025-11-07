
/**
 * Workflow Automation System
 * Enables creating automated workflows with triggers and actions
 */

import { useState, useCallback } from 'react';

export type TriggerType =
  | 'task.created'
  | 'task.completed'
  | 'task.overdue'
  | 'note.created'
  | 'note.updated'
  | 'document.uploaded'
  | 'message.received'
  | 'event.upcoming'
  | 'schedule.time'
  | 'manual';

export type ActionType =
  | 'send.notification'
  | 'send.email'
  | 'create.task'
  | 'update.task'
  | 'create.note'
  | 'send.message'
  | 'webhook.call';

export type Trigger = {
  id: string;
  type: TriggerType;
  config: any;
};

export type Action = {
  id: string;
  type: ActionType;
  config: any;
};

export type Workflow = {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  trigger: Trigger;
  conditions?: any[];
  actions: Action[];
  createdAt: string;
  updatedAt: string;
};

class WorkflowEngine {
  private workflows: Map<string, Workflow> = new Map();
  private listeners: Map<TriggerType, Set<(data: any) => void>> = new Map();

  registerWorkflow(workflow: Workflow) {
    this.workflows.set(workflow.id, workflow);
    
    // Register trigger listener
    if (!this.listeners.has(workflow.trigger.type)) {
      this.listeners.set(workflow.trigger.type, new Set());
    }
    
    const handler = (data: any) => {
      if (workflow.enabled) {
        this.executeWorkflow(workflow, data);
      }
    };
    
    this.listeners.get(workflow.trigger.type)!.add(handler);
  }

  unregisterWorkflow(workflowId: string) {
    this.workflows.delete(workflowId);
  }

  async executeWorkflow(workflow: Workflow, triggerData: any) {
    console.log(`Executing workflow: ${workflow.name}`, triggerData);

    // Check conditions
    if (workflow.conditions && workflow.conditions.length > 0) {
      const conditionsMet = this.checkConditions(workflow.conditions, triggerData);
      if (!conditionsMet) {
        console.log('Workflow conditions not met');
        return;
      }
    }

    // Execute actions sequentially
    for (const action of workflow.actions) {
      try {
        await this.executeAction(action, triggerData);
      } catch (error) {
        console.error(`Failed to execute action ${action.type}:`, error);
      }
    }
  }

  private checkConditions(conditions: any[], data: any): boolean {
    // Simple condition checking - can be expanded
    return conditions.every(condition => {
      const value = this.getValueByPath(data, condition.field);
      return this.evaluateCondition(value, condition.operator, condition.value);
    });
  }

  private getValueByPath(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private evaluateCondition(value: any, operator: string, expected: any): boolean {
    switch (operator) {
      case 'equals':
        return value === expected;
      case 'notEquals':
        return value !== expected;
      case 'contains':
        return String(value).includes(expected);
      case 'greaterThan':
        return value > expected;
      case 'lessThan':
        return value < expected;
      default:
        return true;
    }
  }

  private async executeAction(action: Action, triggerData: any): Promise<void> {
    switch (action.type) {
      case 'send.notification':
        await this.sendNotification(action.config, triggerData);
        break;
      case 'send.email':
        await this.sendEmail(action.config, triggerData);
        break;
      case 'create.task':
        await this.createTask(action.config, triggerData);
        break;
      case 'create.note':
        await this.createNote(action.config, triggerData);
        break;
      case 'send.message':
        await this.sendMessage(action.config, triggerData);
        break;
      case 'webhook.call':
        await this.callWebhook(action.config, triggerData);
        break;
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }

  private async sendNotification(config: any, data: any) {
    console.log('Sending notification:', config, data);
    // TODO: Implement notification sending
  }

  private async sendEmail(config: any, data: any) {
    console.log('Sending email:', config, data);
    // TODO: Implement email sending
  }

  private async createTask(config: any, data: any) {
    console.log('Creating task:', config, data);
    // TODO: Implement task creation
  }

  private async createNote(config: any, data: any) {
    console.log('Creating note:', config, data);
    // TODO: Implement note creation
  }

  private async sendMessage(config: any, data: any) {
    console.log('Sending message:', config, data);
    // TODO: Implement message sending
  }

  private async callWebhook(config: any, data: any) {
    console.log('Calling webhook:', config, data);
    try {
      const response = await fetch(config.url, {
        method: config.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Webhook call failed:', error);
      throw error;
    }
  }

  triggerEvent(triggerType: TriggerType, data: any) {
    const listeners = this.listeners.get(triggerType);
    if (listeners) {
      listeners.forEach(handler => handler(data));
    }
  }

  getWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  getWorkflow(id: string): Workflow | undefined {
    return this.workflows.get(id);
  }

  updateWorkflow(id: string, updates: Partial<Workflow>): Workflow | undefined {
    const workflow = this.workflows.get(id);
    if (workflow) {
      const updated = {
        ...workflow,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.workflows.set(id, updated);
      return updated;
    }
    return undefined;
  }
}

export const workflowEngine = new WorkflowEngine();

/**
 * Hook for managing workflows
 */
export function useWorkflowAutomation() {
  const [workflows, setWorkflows] = useState<Workflow[]>(workflowEngine.getWorkflows());

  const createWorkflow = useCallback((workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newWorkflow: Workflow = {
      ...workflow,
      id: `workflow-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    workflowEngine.registerWorkflow(newWorkflow);
    setWorkflows(workflowEngine.getWorkflows());

    return newWorkflow;
  }, []);

  const updateWorkflow = useCallback((id: string, updates: Partial<Workflow>) => {
    const updated = workflowEngine.updateWorkflow(id, updates);
    setWorkflows(workflowEngine.getWorkflows());
    return updated;
  }, []);

  const deleteWorkflow = useCallback((id: string) => {
    workflowEngine.unregisterWorkflow(id);
    setWorkflows(workflowEngine.getWorkflows());
  }, []);

  const triggerWorkflow = useCallback((triggerType: TriggerType, data: any) => {
    workflowEngine.triggerEvent(triggerType, data);
  }, []);

  return {
    workflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    triggerWorkflow,
  };
}

/**
 * Predefined workflow templates
 */
export const workflowTemplates: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Overdue Task Reminder',
    description: 'Send a notification when a task becomes overdue',
    enabled: true,
    trigger: {
      id: 'trigger-1',
      type: 'task.overdue',
      config: {},
    },
    actions: [
      {
        id: 'action-1',
        type: 'send.notification',
        config: {
          title: 'Task Overdue',
          message: 'You have an overdue task: {{task.title}}',
        },
      },
    ],
  },
  {
    name: 'New Document Upload Notification',
    description: 'Notify team members when a new document is uploaded',
    enabled: true,
    trigger: {
      id: 'trigger-2',
      type: 'document.uploaded',
      config: {},
    },
    actions: [
      {
        id: 'action-2',
        type: 'send.notification',
        config: {
          title: 'New Document',
          message: 'A new document has been uploaded: {{document.name}}',
        },
      },
    ],
  },
  {
    name: 'Daily Task Summary',
    description: 'Send a daily summary of incomplete tasks',
    enabled: true,
    trigger: {
      id: 'trigger-3',
      type: 'schedule.time',
      config: {
        time: '09:00',
        timezone: 'America/New_York',
      },
    },
    actions: [
      {
        id: 'action-3',
        type: 'send.email',
        config: {
          subject: 'Daily Task Summary',
          template: 'daily-tasks',
        },
      },
    ],
  },
];
