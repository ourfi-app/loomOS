
/**
 * App Version Control
 * Track and manage versions of app designs
 */

export interface AppVersion {
  id: string;
  appId: string;
  version: string; // e.g., "1.0.0", "1.1.0"
  timestamp: string;
  author: string;
  message: string;
  snapshot: any; // Complete app state
  changes: VersionChange[];
}

export interface VersionChange {
  type: 'added' | 'modified' | 'removed';
  path: string;
  description: string;
  oldValue?: any;
  newValue?: any;
}

export interface VersionHistory {
  appId: string;
  appName: string;
  versions: AppVersion[];
  currentVersion: string;
}

export class VersionControl {
  /**
   * Create a new version
   */
  static createVersion(
    appId: string,
    currentState: any,
    previousState: any | null,
    author: string,
    message: string
  ): AppVersion {
    const changes = previousState 
      ? this.computeChanges(previousState, currentState)
      : [];

    const version = this.incrementVersion(previousState?.version || '0.0.0');

    return {
      id: `v-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      appId,
      version,
      timestamp: new Date().toISOString(),
      author,
      message,
      snapshot: currentState,
      changes,
    };
  }

  /**
   * Compute changes between two states
   */
  private static computeChanges(oldState: any, newState: any): VersionChange[] {
    const changes: VersionChange[] = [];

    // Compare design patterns
    if (JSON.stringify(oldState.designPatterns) !== JSON.stringify(newState.designPatterns)) {
      changes.push({
        type: 'modified',
        path: 'designPatterns',
        description: 'Updated design patterns',
        oldValue: oldState.designPatterns,
        newValue: newState.designPatterns,
      });
    }

    // Compare colors
    if (JSON.stringify(oldState.customizations?.customColors) !== JSON.stringify(newState.customizations?.customColors)) {
      changes.push({
        type: 'modified',
        path: 'customizations.customColors',
        description: 'Updated color scheme',
        oldValue: oldState.customizations?.customColors,
        newValue: newState.customizations?.customColors,
      });
    }

    // Compare layout
    if (oldState.paneLayout !== newState.paneLayout) {
      changes.push({
        type: 'modified',
        path: 'paneLayout',
        description: 'Changed pane layout',
        oldValue: oldState.paneLayout,
        newValue: newState.paneLayout,
      });
    }

    // Compare name and description
    if (oldState.name !== newState.name) {
      changes.push({
        type: 'modified',
        path: 'name',
        description: 'Updated app name',
        oldValue: oldState.name,
        newValue: newState.name,
      });
    }

    if (oldState.description !== newState.description) {
      changes.push({
        type: 'modified',
        path: 'description',
        description: 'Updated description',
        oldValue: oldState.description,
        newValue: newState.description,
      });
    }

    return changes;
  }

  /**
   * Increment version number (semantic versioning)
   */
  private static incrementVersion(version: string): string {
    const [major, minor, patch] = version.split('.').map(Number);
    return `${major || 0}.${minor || 0}.${(patch || 0) + 1}`;
  }

  /**
   * Load version history from localStorage
   */
  static loadHistory(appId: string): VersionHistory | null {
    try {
      const key = `version-history-${appId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to load version history:', e);
      return null;
    }
  }

  /**
   * Save version history to localStorage
   */
  static saveHistory(history: VersionHistory): void {
    try {
      const key = `version-history-${history.appId}`;
      localStorage.setItem(key, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save version history:', e);
    }
  }

  /**
   * Add version to history
   */
  static addVersion(appId: string, appName: string, version: AppVersion): VersionHistory {
    let history = this.loadHistory(appId);

    if (!history) {
      history = {
        appId,
        appName,
        versions: [],
        currentVersion: version.version,
      };
    }

    history.versions.push(version);
    history.currentVersion = version.version;

    this.saveHistory(history);
    return history;
  }

  /**
   * Restore to a specific version
   */
  static restoreVersion(appId: string, versionId: string): any | null {
    const history = this.loadHistory(appId);
    if (!history) return null;

    const version = history.versions.find(v => v.id === versionId);
    return version ? version.snapshot : null;
  }

  /**
   * Compare two versions
   */
  static compareVersions(
    version1: AppVersion,
    version2: AppVersion
  ): VersionChange[] {
    return this.computeChanges(version1.snapshot, version2.snapshot);
  }

  /**
   * Get version diff summary
   */
  static getVersionSummary(version: AppVersion): string {
    const addedCount = version.changes.filter(c => c.type === 'added').length;
    const modifiedCount = version.changes.filter(c => c.type === 'modified').length;
    const removedCount = version.changes.filter(c => c.type === 'removed').length;

    const parts: string[] = [];
    if (addedCount > 0) parts.push(`${addedCount} added`);
    if (modifiedCount > 0) parts.push(`${modifiedCount} modified`);
    if (removedCount > 0) parts.push(`${removedCount} removed`);

    return parts.length > 0 ? parts.join(', ') : 'No changes';
  }

  /**
   * Export version history
   */
  static exportHistory(appId: string): string | null {
    const history = this.loadHistory(appId);
    return history ? JSON.stringify(history, null, 2) : null;
  }

  /**
   * Import version history
   */
  static importHistory(json: string): boolean {
    try {
      const history = JSON.parse(json) as VersionHistory;
      this.saveHistory(history);
      return true;
    } catch (e) {
      console.error('Failed to import version history:', e);
      return false;
    }
  }

  /**
   * Delete version history
   */
  static deleteHistory(appId: string): void {
    const key = `version-history-${appId}`;
    localStorage.removeItem(key);
  }

  /**
   * Get all app versions
   */
  static getAllVersions(): VersionHistory[] {
    const histories: VersionHistory[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('version-history-')) {
        const history = this.loadHistory(key.replace('version-history-', ''));
        if (history) {
          histories.push(history);
        }
      }
    }
    
    return histories;
  }
}

export default VersionControl;
