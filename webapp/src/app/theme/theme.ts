import { createTheme, ThemeOptions } from '@mui/material/styles';

// Paleta de colores moderna y profesional - Tonos azules suaves
const palette = {
  primary: {
    main: '#4A90E2', // Azul suave principal
    light: '#7BA7D9',
    dark: '#2C5F8D',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#5B7C99', // Azul grisáceo
    light: '#8FA9BF',
    dark: '#3A5166',
    contrastText: '#ffffff',
  },
  success: {
    main: '#4A90E2', // Azul suave (consistente)
    light: '#7BA7D9',
    dark: '#2C5F8D',
  },
  error: {
    main: '#94A3B8', // Gris azulado suave (en lugar de rojo agresivo)
    light: '#CBD5E1',
    dark: '#64748B',
  },
  warning: {
    main: '#7BA7D9', // Azul claro (en lugar de naranja)
    light: '#A8C5E5',
    dark: '#5B7C99',
  },
  info: {
    main: '#4A90E2',
    light: '#7BA7D9',
    dark: '#2C5F8D',
  },
  background: {
    default: '#f8fafc', // Gris muy claro
    paper: '#ffffff',
  },
  text: {
    primary: '#1e293b', // Gris oscuro moderno
    secondary: '#64748b',
  },
  divider: '#e2e8f0',
};

// Tipografía moderna
const typography = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h6: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
  button: {
    textTransform: 'none' as const,
    fontWeight: 600,
    letterSpacing: '0.02em',
  },
};

// Componentes personalizados
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '6px',
        padding: '10px 24px',
        fontSize: '0.95rem',
        fontWeight: 600,
        boxShadow: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-1px)',
        },
      },
      contained: {
        '&:hover': {
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
        },
      },
      outlined: {
        borderWidth: '2px',
        '&:hover': {
          borderWidth: '2px',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 6px 10px rgba(0, 0, 0, 0.08)',
          transform: 'translateY(-2px)',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        backgroundImage: 'none',
      },
      elevation1: {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      elevation2: {
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      elevation3: {
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: '6px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: palette.primary.light,
            },
          },
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderWidth: '2px',
            },
          },
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: '6px',
        fontWeight: 500,
        fontSize: '0.875rem',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: '1px solid #e2e8f0',
      },
      head: {
        fontWeight: 600,
        fontSize: '0.875rem',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
        color: palette.text.secondary,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: '8px',
        boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        border: '2px solid white',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      },
    },
  },
};

// Crear el tema
const theme = createTheme({
  palette,
  typography,
  components,
  shape: {
    borderRadius: 6,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.06)',
    '0 10px 15px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.08)',
    '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
    '0 25px 50px rgba(0, 0, 0, 0.12), 0 12px 18px rgba(0, 0, 0, 0.08)',
    '0 2px 4px rgba(0,0,0,0.1)',
    '0 4px 8px rgba(0,0,0,0.1)',
    '0 8px 16px rgba(0,0,0,0.1)',
    '0 12px 24px rgba(0,0,0,0.1)',
    '0 16px 32px rgba(0,0,0,0.1)',
    '0 20px 40px rgba(0,0,0,0.1)',
    '0 24px 48px rgba(0,0,0,0.1)',
    '0 28px 56px rgba(0,0,0,0.1)',
    '0 32px 64px rgba(0,0,0,0.1)',
    '0 36px 72px rgba(0,0,0,0.1)',
    '0 40px 80px rgba(0,0,0,0.1)',
    '0 44px 88px rgba(0,0,0,0.1)',
    '0 48px 96px rgba(0,0,0,0.1)',
    '0 52px 104px rgba(0,0,0,0.1)',
    '0 56px 112px rgba(0,0,0,0.1)',
    '0 60px 120px rgba(0,0,0,0.1)',
    '0 64px 128px rgba(0,0,0,0.1)',
    '0 68px 136px rgba(0,0,0,0.1)',
    '0 72px 144px rgba(0,0,0,0.1)',
  ],
} as ThemeOptions);

export default theme;

