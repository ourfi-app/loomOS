import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Add custom providers here if needed (e.g., ThemeProvider, etc.)
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
