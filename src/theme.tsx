import React from 'react';
import { css } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
//import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
//import { LinkProps } from '@mui/material/Link';

import { COLORS } from './utils/constants';

/*
const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});
 */

// https://tailwindcss.com/docs/customizing-colors
export function createCustomTheme(isDark: boolean) {
  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: isDark ? COLORS.primaryDark : COLORS.primary,
      },
      secondary: {
        main: isDark ? COLORS.secondaryDark : COLORS.secondary,
      },
    },
    /*
    components: {
      MuiLink: {
        defaultProps: {
          component: LinkBehavior,
        } as LinkProps,
      },
      MuiButtonBase: {
        defaultProps: {
          LinkComponent: LinkBehavior,
        },
      },
    },
     */
  });
}

export const inputGlobalStyles = (
  <GlobalStyles
    styles={css`
      html {
        height: 100%;
        font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Fira Sans',
          'Droid Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      }

      body {
        height: 100%;
        margin: 0;
        padding: 0;
      }

      #root {
        height: 100%;
      }
    `}
  />
);
