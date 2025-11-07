/**
 * loomOS Activity Manager
 *
 * Activity-centric architecture instead of app-centric.
 *
 * Core Philosophy:
 * - Users think in terms of what they want to DO, not which app to use
 * - Activities can span multiple apps and data sources
 * - Context is preserved and shared across related activities
 * - Liberation from app silos - data flows freely where needed
 */

export interface UserIntent {
  type: 'email' | 'schedule' | 'task' | 'social' | 'document' | 'media' | 'custom';
  action: 'view' | 'create' | 'edit' | 'share' | 'search' | 'organize';
  target?: string;  // What the user wants to interact with
  context?: Record<string, unknown>;  // Additional context
}

export interface Activity {
  id: string;
  type: string;
  intent: UserIntent;
  cards: ActivityCard[];
  context: ActivityContext;
  created: Date;
  lastAccessed: Date;
  isFavorite: boolean;
  tags: string[];
}

export interface ActivityCard {
  id: string;
  appId: string;
  appName: string;
  title: string;
  state: Record<string, unknown>;  // Serialized app state
  isActive: boolean;
}

export interface ActivityContext {
  // Aggregated context from all participating apps
  relatedContacts?: Contact[];
  relatedFiles?: File[];
  relatedEvents?: Event[];
  relatedTasks?: Task[];
  sharedData?: Record<string, unknown>;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface File {
  id: string;
  name: string;
  type: string;
  path: string;
  size: number;
  modified: Date;
}

export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
}

/**
 * LoomOSActivityManager
 *
 * Manages activities across the system.
 * Activities are user-centric workflows that can involve multiple apps.
 */
export class LoomOSActivityManager {
  private activities: Map<string, Activity> = new Map();
  private activeActivityId: string | null = null;
  private listeners: Set<(activities: Activity[]) => void> = new Set();

  /**
   * Create a new activity from user intent
   */
  createActivity(intent: UserIntent): Activity {
    const activity: Activity = {
      id: this.generateId(),
      type: intent.type,
      intent,
      cards: [],
      context: this.gatherContextFromIntent(intent),
      created: new Date(),
      lastAccessed: new Date(),
      isFavorite: false,
      tags: [],
    };

    this.activities.set(activity.id, activity);
    this.notifyListeners();

    return activity;
  }

  /**
   * Add a card to an activity
   */
  addCardToActivity(activityId: string, card: ActivityCard): void {
    const activity = this.activities.get(activityId);
    if (!activity) {
      throw new Error(`Activity ${activityId} not found`);
    }

    activity.cards.push(card);
    activity.lastAccessed = new Date();

    // Update context based on new card
    this.updateActivityContext(activity);

    this.notifyListeners();
  }

  /**
   * Remove a card from an activity
   */
  removeCardFromActivity(activityId: string, cardId: string): void {
    const activity = this.activities.get(activityId);
    if (!activity) return;

    activity.cards = activity.cards.filter(card => card.id !== cardId);

    // If no cards left, delete the activity
    if (activity.cards.length === 0) {
      this.activities.delete(activityId);
    }

    this.notifyListeners();
  }

  /**
   * Get all activities
   */
  getActivities(): Activity[] {
    return Array.from(this.activities.values())
      .sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime());
  }

  /**
   * Get active activity
   */
  getActiveActivity(): Activity | null {
    if (!this.activeActivityId) return null;
    return this.activities.get(this.activeActivityId) || null;
  }

  /**
   * Set active activity
   */
  setActiveActivity(activityId: string | null): void {
    this.activeActivityId = activityId;

    if (activityId) {
      const activity = this.activities.get(activityId);
      if (activity) {
        activity.lastAccessed = new Date();
      }
    }

    this.notifyListeners();
  }

  /**
   * Merge data from multiple sources for unified view
   */
  mergeDataSources(activity: Activity): Record<string, unknown> {
    const mergedData: Record<string, unknown> = {
      contacts: activity.context.relatedContacts || [],
      files: activity.context.relatedFiles || [],
      events: activity.context.relatedEvents || [],
      tasks: activity.context.relatedTasks || [],
    };

    // Aggregate from all cards in the activity
    activity.cards.forEach(card => {
      if (card.state.contacts) {
        mergedData.contacts = [
          ...(mergedData.contacts as Contact[]),
          ...(card.state.contacts as Contact[]),
        ];
      }
      if (card.state.files) {
        mergedData.files = [
          ...(mergedData.files as File[]),
          ...(card.state.files as File[]),
        ];
      }
      // ... merge other data types
    });

    // Remove duplicates
    mergedData.contacts = this.deduplicateById(mergedData.contacts as Array<{ id: string }>);
    mergedData.files = this.deduplicateById(mergedData.files as Array<{ id: string }>);
    mergedData.events = this.deduplicateById(mergedData.events as Array<{ id: string }>);
    mergedData.tasks = this.deduplicateById(mergedData.tasks as Array<{ id: string }>);

    return mergedData;
  }

  /**
   * Get related activities based on context
   */
  getRelatedActivities(activityId: string): Activity[] {
    const activity = this.activities.get(activityId);
    if (!activity) return [];

    return this.getActivities().filter(a => {
      if (a.id === activityId) return false;

      // Check for shared context
      const sharedContacts = this.hasSharedItems(
        activity.context.relatedContacts,
        a.context.relatedContacts
      );
      const sharedFiles = this.hasSharedItems(
        activity.context.relatedFiles,
        a.context.relatedFiles
      );

      return sharedContacts || sharedFiles;
    });
  }

  /**
   * Subscribe to activity changes
   */
  subscribe(listener: (activities: Activity[]) => void): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Save activities to persistent storage
   */
  async saveActivities(): Promise<void> {
    const activitiesData = Array.from(this.activities.values());

    try {
      localStorage.setItem('loomos-activities', JSON.stringify(activitiesData));
    } catch (error) {
      console.error('Failed to save activities:', error);
    }
  }

  /**
   * Load activities from persistent storage
   */
  async loadActivities(): Promise<void> {
    try {
      const saved = localStorage.getItem('loomos-activities');
      if (saved) {
        const activitiesData = JSON.parse(saved);
        activitiesData.forEach((activity: Activity) => {
          // Restore Date objects
          activity.created = new Date(activity.created);
          activity.lastAccessed = new Date(activity.lastAccessed);
          this.activities.set(activity.id, activity);
        });
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to load activities:', error);
    }
  }

  // Private helper methods

  private generateId(): string {
    return `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private gatherContextFromIntent(intent: UserIntent): ActivityContext {
    // In a real implementation, this would query various data sources
    // based on the intent to gather relevant context
    return {
      relatedContacts: [],
      relatedFiles: [],
      relatedEvents: [],
      relatedTasks: [],
      sharedData: intent.context || {},
    };
  }

  private updateActivityContext(activity: Activity): void {
    // Update context based on all cards in the activity
    const mergedContext = this.mergeDataSources(activity);

    activity.context.relatedContacts = mergedContext.contacts as Contact[];
    activity.context.relatedFiles = mergedContext.files as File[];
    activity.context.relatedEvents = mergedContext.events as Event[];
    activity.context.relatedTasks = mergedContext.tasks as Task[];
  }

  private deduplicateById<T extends { id: string }>(items: T[]): T[] {
    const seen = new Set<string>();
    return items.filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }

  private hasSharedItems<T extends { id: string }>(
    items1: T[] | undefined,
    items2: T[] | undefined
  ): boolean {
    if (!items1 || !items2) return false;

    const ids1 = new Set(items1.map(item => item.id));
    return items2.some(item => ids1.has(item.id));
  }

  private notifyListeners(): void {
    const activities = this.getActivities();
    this.listeners.forEach(listener => listener(activities));
  }
}

// Singleton instance
let activityManagerInstance: LoomOSActivityManager | null = null;

/**
 * Get the global activity manager instance
 */
export function getActivityManager(): LoomOSActivityManager {
  if (!activityManagerInstance) {
    activityManagerInstance = new LoomOSActivityManager();
    // Auto-load on first access
    activityManagerInstance.loadActivities();
  }
  return activityManagerInstance;
}

/**
 * React hook for using the activity manager
 */
export function useActivityManager() {
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const manager = getActivityManager();

  React.useEffect(() => {
    setActivities(manager.getActivities());

    const unsubscribe = manager.subscribe((updated) => {
      setActivities(updated);
    });

    return unsubscribe;
  }, [manager]);

  return {
    activities,
    activeActivity: manager.getActiveActivity(),
    createActivity: (intent: UserIntent) => manager.createActivity(intent),
    setActiveActivity: (id: string | null) => manager.setActiveActivity(id),
    addCard: (activityId: string, card: ActivityCard) =>
      manager.addCardToActivity(activityId, card),
    removeCard: (activityId: string, cardId: string) =>
      manager.removeCardFromActivity(activityId, cardId),
    getRelatedActivities: (activityId: string) =>
      manager.getRelatedActivities(activityId),
  };
}

// Make React available for the hook
import * as React from 'react';

export default {
  LoomOSActivityManager,
  getActivityManager,
  useActivityManager,
};
