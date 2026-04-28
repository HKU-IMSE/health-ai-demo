import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7c3aed', // violet-600
      dark: '#6d28d9', // violet-700
      light: '#ede9fe', // violet-100
      contrastText: '#ffffff',
    },
    error: {
      main: '#b91c1c',
    },
    background: {
      default: '#f5f3ff', // violet-50-ish
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'inherit',
  },
  components: {
    MuiTextField: {
      defaultProps: {
        size: 'small',
        fullWidth: true,
      },
    },
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
