/**
 * loomOS Liberation Features
 *
 * Core features that liberate users from vendor lock-in:
 * - Open marketplace (no app store fees or restrictions)
 * - Progressive Web Apps as first-class citizens
 * - Cloud service unification (Synergy)
 * - Data portability and ownership
 *
 * Philosophy: Your data, your choice, your freedom
 */

/**
 * ============================================
 * MARKETPLACE - Freedom from App Store Lock-in
 * ============================================
 */

export interface LoomOSApp {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  icon: string;
  screenshots: string[];
  categories: string[];
  permissions: Permission[];
  installUrl?: string;  // Direct URL for installation
  manifestUrl?: string; // PWA manifest URL
  source: 'marketplace' | 'pwa' | 'url' | 'sideload';
  rating?: number;
  downloads?: number;
  lastUpdated: Date;
  size?: number;  // in bytes
}

export interface Permission {
  type: 'storage' | 'location' | 'camera' | 'microphone' | 'notifications' | 'contacts' | 'calendar';
  reason: string;
}

export interface PWAManifest {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  theme_color: string;
  background_color: string;
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
  }>;
  scope?: string;
  orientation?: string;
}

/**
 * LoomOS Marketplace
 *
 * Open marketplace for app discovery and installation.
 * No walled garden, no fees, no restrictions.
 */
export class LoomOSMarketplace {
  private installedApps: Map<string, LoomOSApp> = new Map();
  private listeners: Set<(apps: LoomOSApp[]) => void> = new Set();

  /**
   * Install app from any URL
   * Liberation: Install from anywhere, not just official stores
   */
  async installFromURL(url: string): Promise<LoomOSApp> {
    try {
      const response = await fetch(url);
      const appData = await response.json();

      const app: LoomOSApp = {
        ...appData,
        source: 'url',
        lastUpdated: new Date(),
      };

      // Validate app data
      this.validateApp(app);

      // Request permissions from user
      const granted = await this.requestPermissions(app.permissions);
      if (!granted) {
        throw new Error('User denied required permissions');
      }

      // Install the app
      this.installedApps.set(app.id, app);
      await this.saveInstalledApps();
      this.notifyListeners();

      return app;
    } catch (error) {
      throw new Error(`Failed to install app from URL: ${error}`);
    }
  }

  /**
   * Install Progressive Web App
   * Liberation: PWAs are first-class citizens
   */
  async installPWA(manifestUrl: string): Promise<LoomOSApp> {
    try {
      const response = await fetch(manifestUrl);
      const manifest: PWAManifest = await response.json();

      const app: LoomOSApp = {
        id: this.generateAppId(manifest.name),
        name: manifest.name,
        description: manifest.description,
        version: '1.0.0',
        author: new URL(manifestUrl).hostname,
        icon: manifest.icons[0]?.src || '',
        screenshots: [],
        categories: ['web'],
        permissions: [],
        manifestUrl,
        source: 'pwa',
        lastUpdated: new Date(),
      };

      this.installedApps.set(app.id, app);
      await this.saveInstalledApps();
      this.notifyListeners();

      return app;
    } catch (error) {
      throw new Error(`Failed to install PWA: ${error}`);
    }
  }

  /**
   * Publish app to marketplace
   * Liberation: No fees, no審查 (censorship)
   */
  async publishApp(app: LoomOSApp): Promise<void> {
    // Validate app
    this.validateApp(app);

    // In a real implementation, this would submit to a decentralized marketplace
    // or peer-to-peer network, not a centralized app store

    // For now, just add to installed apps
    this.installedApps.set(app.id, app);
    await this.saveInstalledApps();
    this.notifyListeners();
  }

  /**
   * Uninstall app
   */
  async uninstallApp(appId: string): Promise<void> {
    this.installedApps.delete(appId);
    await this.saveInstalledApps();
    this.notifyListeners();
  }

  /**
   * Get installed apps
   */
  getInstalledApps(): LoomOSApp[] {
    return Array.from(this.installedApps.values());
  }

  /**
   * Search marketplace
   */
  async searchMarketplace(query: string): Promise<LoomOSApp[]> {
    // In a real implementation, this would search a decentralized marketplace
    // For now, return installed apps that match
    return this.getInstalledApps().filter(app =>
      app.name.toLowerCase().includes(query.toLowerCase()) ||
      app.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Private methods

  private validateApp(app: LoomOSApp): void {
    if (!app.id || !app.name || !app.version) {
      throw new Error('Invalid app data: missing required fields');
    }
  }

  private async requestPermissions(permissions: Permission[]): Promise<boolean> {
    // In a real implementation, this would show a permissions dialog
    // For now, just return true
    return true;
  }

  private generateAppId(name: string): string {
    return `app-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
  }

  private async saveInstalledApps(): Promise<void> {
    try {
      const apps = Array.from(this.installedApps.values());
      localStorage.setItem('loomos-installed-apps', JSON.stringify(apps));
    } catch (error) {
      console.error('Failed to save installed apps:', error);
    }
  }

  async loadInstalledApps(): Promise<void> {
    try {
      const saved = localStorage.getItem('loomos-installed-apps');
      if (saved) {
        const apps = JSON.parse(saved);
        apps.forEach((app: LoomOSApp) => {
          app.lastUpdated = new Date(app.lastUpdated);
          this.installedApps.set(app.id, app);
        });
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to load installed apps:', error);
    }
  }

  subscribe(listener: (apps: LoomOSApp[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const apps = this.getInstalledApps();
    this.listeners.forEach(listener => listener(apps));
  }
}

/**
 * ============================================
 * SYNERGY - Freedom from Cloud Lock-in
 * ============================================
 */

export interface CloudService {
  id: string;
  name: string;
  type: 'email' | 'calendar' | 'contacts' | 'files' | 'photos' | 'notes';
  provider: string;  // 'google' | 'microsoft' | 'apple' | 'nextcloud' | etc
  credentials: CloudCredentials;
  isConnected: boolean;
  lastSync?: Date;
}

export interface CloudCredentials {
  apiKey?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export interface UnifiedContact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  sources: Array<{
    serviceId: string;
    originalId: string;
  }>;
  merged: boolean;
}

export interface UnifiedEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  sources: Array<{
    serviceId: string;
    originalId: string;
  }>;
  merged: boolean;
}

export interface UnifiedFile {
  id: string;
  name: string;
  path: string;
  size: number;
  mimeType: string;
  modified: Date;
  sources: Array<{
    serviceId: string;
    originalId: string;
  }>;
  merged: boolean;
}

/**
 * LoomOS Synergy
 *
 * Unify data from multiple cloud services.
 * Liberation: Your data from all sources, in one place, under your control.
 */
export class LoomOSSynergy {
  private connectedServices: Map<string, CloudService> = new Map();
  private unifiedContacts: Map<string, UnifiedContact> = new Map();
  private unifiedCalendars: Map<string, UnifiedEvent> = new Map();
  private unifiedFiles: Map<string, UnifiedFile> = new Map();
  private listeners: Set<() => void> = new Set();

  /**
   * Connect a cloud service
   */
  async connectService(service: CloudService): Promise<void> {
    // Validate credentials
    await this.validateServiceCredentials(service);

    // Store service
    this.connectedServices.set(service.id, service);

    // Trigger initial sync
    await this.syncService(service.id);

    await this.saveConnectedServices();
    this.notifyListeners();
  }

  /**
   * Disconnect a cloud service
   */
  async disconnectService(serviceId: string): Promise<void> {
    // Remove service
    this.connectedServices.delete(serviceId);

    // Remove data from this service
    this.removeServiceData(serviceId);

    await this.saveConnectedServices();
    this.notifyListeners();
  }

  /**
   * Sync a specific service
   */
  async syncService(serviceId: string): Promise<void> {
    const service = this.connectedServices.get(serviceId);
    if (!service) {
      throw new Error(`Service ${serviceId} not found`);
    }

    try {
      // In a real implementation, this would call the service's API
      // For now, just update lastSync
      service.lastSync = new Date();
      service.isConnected = true;
      this.notifyListeners();
    } catch (error) {
      service.isConnected = false;
      throw new Error(`Failed to sync service ${service.name}: ${error}`);
    }
  }

  /**
   * Sync all connected services
   */
  async syncAll(): Promise<void> {
    const syncPromises = Array.from(this.connectedServices.keys()).map(
      serviceId => this.syncService(serviceId)
    );
    await Promise.allSettled(syncPromises);
  }

  /**
   * Unify contacts from all services
   */
  unifyContacts(): UnifiedContact[] {
    // In a real implementation, this would:
    // 1. Fetch contacts from all connected services
    // 2. Detect duplicates using fuzzy matching
    // 3. Merge duplicate contacts
    // 4. Return unified list

    return Array.from(this.unifiedContacts.values());
  }

  /**
   * Unify calendars from all services
   */
  unifyCalendars(): UnifiedEvent[] {
    // Similar to contacts, but for calendar events
    return Array.from(this.unifiedCalendars.values());
  }

  /**
   * Unify files from all services
   */
  unifyFiles(): UnifiedFile[] {
    // Similar to contacts, but for files
    return Array.from(this.unifiedFiles.values());
  }

  /**
   * Get connected services
   */
  getConnectedServices(): CloudService[] {
    return Array.from(this.connectedServices.values());
  }

  // Private methods

  private async validateServiceCredentials(service: CloudService): Promise<boolean> {
    // In a real implementation, this would validate the credentials
    // by making a test API call
    return true;
  }

  private removeServiceData(serviceId: string): void {
    // Remove contacts from this service
    this.unifiedContacts.forEach((contact, id) => {
      contact.sources = contact.sources.filter(s => s.serviceId !== serviceId);
      if (contact.sources.length === 0) {
        this.unifiedContacts.delete(id);
      }
    });

    // Remove events from this service
    this.unifiedCalendars.forEach((event, id) => {
      event.sources = event.sources.filter(s => s.serviceId !== serviceId);
      if (event.sources.length === 0) {
        this.unifiedCalendars.delete(id);
      }
    });

    // Remove files from this service
    this.unifiedFiles.forEach((file, id) => {
      file.sources = file.sources.filter(s => s.serviceId !== serviceId);
      if (file.sources.length === 0) {
        this.unifiedFiles.delete(id);
      }
    });
  }

  private async saveConnectedServices(): Promise<void> {
    try {
      const services = Array.from(this.connectedServices.values());
      localStorage.setItem('loomos-connected-services', JSON.stringify(services));
    } catch (error) {
      console.error('Failed to save connected services:', error);
    }
  }

  async loadConnectedServices(): Promise<void> {
    try {
      const saved = localStorage.getItem('loomos-connected-services');
      if (saved) {
        const services = JSON.parse(saved);
        services.forEach((service: CloudService) => {
          if (service.lastSync) {
            service.lastSync = new Date(service.lastSync);
          }
          if (service.credentials.expiresAt) {
            service.credentials.expiresAt = new Date(service.credentials.expiresAt);
          }
          this.connectedServices.set(service.id, service);
        });
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to load connected services:', error);
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

// Singleton instances
let marketplaceInstance: LoomOSMarketplace | null = null;
let synergyInstance: LoomOSSynergy | null = null;

/**
 * Get the global marketplace instance
 */
export function getMarketplace(): LoomOSMarketplace {
  if (!marketplaceInstance) {
    marketplaceInstance = new LoomOSMarketplace();
    marketplaceInstance.loadInstalledApps();
  }
  return marketplaceInstance;
}

/**
 * Get the global synergy instance
 */
export function getSynergy(): LoomOSSynergy {
  if (!synergyInstance) {
    synergyInstance = new LoomOSSynergy();
    synergyInstance.loadConnectedServices();
  }
  return synergyInstance;
}

export default {
  LoomOSMarketplace,
  LoomOSSynergy,
  getMarketplace,
  getSynergy,
};
