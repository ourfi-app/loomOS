import { create } from 'zustand';
import { AppDefinition } from '../enhanced-app-registry';

export type AppState = 'closed' | 'minimized' | 'fullscreen';

export interface RunningApp {
  id: string;
  appDef: AppDefinition;
  state: AppState;
  timestamp: number;
  component?: React.ReactNode;
}

interface AppStore {
  // State
  runningApps: RunningApp[];
  launcherOpen: boolean;
  
  // App Management Actions
  launchApp: (appDef: AppDefinition) => void;
  closeApp: (appId: string) => void;
  minimizeApp: (appId: string) => void;
  restoreApp: (appId: string) => void;
  
  // Launcher Actions
  openLauncher: () => void;
  closeLauncher: () => void;
  toggleLauncher: () => void;
  
  // Utility Actions
  getRunningApp: (appId: string) => RunningApp | undefined;
  isAppRunning: (appId: string) => boolean;
  getFullscreenApp: () => RunningApp | undefined;
  getMinimizedApps: () => RunningApp[];
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial State
  runningApps: [],
  launcherOpen: false,
  
  // App Management Actions
  launchApp: (appDef: AppDefinition) => {
    const existingApp = get().getRunningApp(appDef.id);
    
    if (existingApp) {
      // If app is already running, restore it to fullscreen
      set((state) => ({
        runningApps: state.runningApps.map((app) =>
          app.id === appDef.id
            ? { ...app, state: 'fullscreen' as AppState }
            : app.state === 'fullscreen'
            ? { ...app, state: 'minimized' as AppState }
            : app
        ),
        launcherOpen: false,
      }));
    } else {
      // Launch new app
      set((state) => ({
        runningApps: [
          // Minimize any currently fullscreen app
          ...state.runningApps.map((app) =>
            app.state === 'fullscreen'
              ? { ...app, state: 'minimized' as AppState }
              : app
          ),
          // Add new app in fullscreen
          {
            id: appDef.id,
            appDef,
            state: 'fullscreen' as AppState,
            timestamp: Date.now(),
          },
        ],
        launcherOpen: false,
      }));
    }
  },
  
  closeApp: (appId: string) => {
    set((state) => ({
      runningApps: state.runningApps.filter((app) => app.id !== appId),
    }));
  },
  
  minimizeApp: (appId: string) => {
    set((state) => ({
      runningApps: state.runningApps.map((app) =>
        app.id === appId ? { ...app, state: 'minimized' as AppState } : app
      ),
    }));
  },
  
  restoreApp: (appId: string) => {
    set((state) => ({
      runningApps: state.runningApps.map((app) =>
        app.id === appId
          ? { ...app, state: 'fullscreen' as AppState }
          : app.state === 'fullscreen'
          ? { ...app, state: 'minimized' as AppState }
          : app
      ),
    }));
  },
  
  // Launcher Actions
  openLauncher: () => set({ launcherOpen: true }),
  closeLauncher: () => set({ launcherOpen: false }),
  toggleLauncher: () => set((state) => ({ launcherOpen: !state.launcherOpen })),
  
  // Utility Actions
  getRunningApp: (appId: string) => {
    return get().runningApps.find((app) => app.id === appId);
  },
  
  isAppRunning: (appId: string) => {
    return get().runningApps.some((app) => app.id === appId);
  },
  
  getFullscreenApp: () => {
    return get().runningApps.find((app) => app.state === 'fullscreen');
  },
  
  getMinimizedApps: () => {
    return get().runningApps.filter((app) => app.state === 'minimized');
  },
}));
