import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta = {
  title: 'Design System/Design Tokens',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const TokenDisplay = ({ tokens, title }: { tokens: { name: string; value: string; cssVar: string }[]; title: string }) => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-6">{title}</h2>
    <div className="grid gap-4">
      {tokens.map((token) => (
        <div key={token.name} className="flex items-center gap-4 p-4 border rounded-lg">
          <div className="flex-1">
            <div className="font-semibold">{token.name}</div>
            <div className="text-sm text-muted-foreground">{token.cssVar}</div>
          </div>
          <div className="text-sm font-mono bg-muted px-3 py-1 rounded">{token.value}</div>
        </div>
      ))}
    </div>
  </div>
);

export const Colors: Story = {
  render: () => (
    <div className="space-y-8">
      <TokenDisplay
        title="Primary Colors"
        tokens={[
          { name: 'Background', value: 'hsl(var(--background))', cssVar: '--background' },
          { name: 'Foreground', value: 'hsl(var(--foreground))', cssVar: '--foreground' },
          { name: 'Primary', value: 'hsl(var(--primary))', cssVar: '--primary' },
          { name: 'Primary Foreground', value: 'hsl(var(--primary-foreground))', cssVar: '--primary-foreground' },
          { name: 'Secondary', value: 'hsl(var(--secondary))', cssVar: '--secondary' },
          { name: 'Secondary Foreground', value: 'hsl(var(--secondary-foreground))', cssVar: '--secondary-foreground' },
        ]}
      />
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Color Swatches</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Background', class: 'bg-background border' },
            { name: 'Foreground', class: 'bg-foreground' },
            { name: 'Primary', class: 'bg-primary' },
            { name: 'Secondary', class: 'bg-secondary' },
            { name: 'Muted', class: 'bg-muted' },
            { name: 'Accent', class: 'bg-accent' },
            { name: 'Destructive', class: 'bg-destructive' },
            { name: 'Border', class: 'bg-border' },
          ].map((color) => (
            <div key={color.name} className="space-y-2">
              <div className={`h-24 rounded-lg ${color.class}`} />
              <div className="text-sm font-medium">{color.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Typography Scale</h2>
        <div className="space-y-4">
          <div className="text-4xl font-bold">Heading 1 - 36px</div>
          <div className="text-3xl font-bold">Heading 2 - 30px</div>
          <div className="text-2xl font-bold">Heading 3 - 24px</div>
          <div className="text-xl font-semibold">Heading 4 - 20px</div>
          <div className="text-lg font-semibold">Heading 5 - 18px</div>
          <div className="text-base">Body - 16px</div>
          <div className="text-sm">Small - 14px</div>
          <div className="text-xs">Extra Small - 12px</div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-6">Font Weights</h2>
        <div className="space-y-2">
          <div className="font-normal">Normal (400)</div>
          <div className="font-medium">Medium (500)</div>
          <div className="font-semibold">Semibold (600)</div>
          <div className="font-bold">Bold (700)</div>
        </div>
      </div>
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Spacing Scale</h2>
      <div className="space-y-4">
        {[
          { name: '0.5 (2px)', class: 'w-0.5' },
          { name: '1 (4px)', class: 'w-1' },
          { name: '2 (8px)', class: 'w-2' },
          { name: '3 (12px)', class: 'w-3' },
          { name: '4 (16px)', class: 'w-4' },
          { name: '6 (24px)', class: 'w-6' },
          { name: '8 (32px)', class: 'w-8' },
          { name: '12 (48px)', class: 'w-12' },
          { name: '16 (64px)', class: 'w-16' },
          { name: '24 (96px)', class: 'w-24' },
        ].map((space) => (
          <div key={space.name} className="flex items-center gap-4">
            <div className="w-32 text-sm font-medium">{space.name}</div>
            <div className={`${space.class} h-8 bg-primary rounded`} />
          </div>
        ))}
      </div>
    </div>
  ),
};

export const BorderRadius: Story = {
  render: () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Border Radius</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { name: 'None', class: 'rounded-none' },
          { name: 'SM', class: 'rounded-sm' },
          { name: 'Default', class: 'rounded' },
          { name: 'MD', class: 'rounded-md' },
          { name: 'LG', class: 'rounded-lg' },
          { name: 'XL', class: 'rounded-xl' },
          { name: '2XL', class: 'rounded-2xl' },
          { name: 'Full', class: 'rounded-full' },
        ].map((radius) => (
          <div key={radius.name} className="space-y-2">
            <div className={`h-24 bg-primary ${radius.class}`} />
            <div className="text-sm font-medium text-center">{radius.name}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Elevation / Shadows</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {[
          { name: 'SM', class: 'shadow-sm' },
          { name: 'Default', class: 'shadow' },
          { name: 'MD', class: 'shadow-md' },
          { name: 'LG', class: 'shadow-lg' },
          { name: 'XL', class: 'shadow-xl' },
          { name: '2XL', class: 'shadow-2xl' },
        ].map((shadow) => (
          <div key={shadow.name} className="space-y-2">
            <div className={`h-32 bg-card rounded-lg ${shadow.class} flex items-center justify-center`}>
              <span className="font-medium">{shadow.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
