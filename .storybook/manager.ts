import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'light',
  brandTitle: 'loomOS Design System',
  brandUrl: 'https://github.com/ourfi-app/loomOS',
  brandTarget: '_blank',
});

addons.setConfig({
  theme,
});
