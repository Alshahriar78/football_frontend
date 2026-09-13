// Media query breakpoints
export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px'
};

// Responsive styles helper
export const responsiveStyles = {
  // Container styles
  container: {
    padding: '1rem',
    '@mobile': {
      padding: '0.75rem'
    }
  },

  // Grid layouts
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1.5rem',
    '@mobile': {
      gridTemplateColumns: '1fr',
      gap: '1rem'
    },
    '@tablet': {
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
    }
  },

  threeColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    '@mobile': {
      gridTemplateColumns: '1fr',
      gap: '0.75rem'
    },
    '@tablet': {
      gridTemplateColumns: 'repeat(2, 1fr)'
    }
  },

  // Header responsive
  headerResponsive: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap',
    '@mobile': {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },

  // Navigation responsive
  navResponsive: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
    '@mobile': {
      gap: '0.5rem',
      justifyContent: 'flex-start',
      overflowX: 'auto',
      paddingBottom: '0.5rem'
    }
  },

  // Table responsive
  tableResponsive: {
    overflowX: 'auto',
    '@mobile': {
      fontSize: '0.75rem'
    }
  }
};

// Media query helper function
export const getMediaQuery = (breakpoint: keyof typeof breakpoints) => {
  return `@media (max-width: ${breakpoints[breakpoint]})`;
};

// Responsive font sizes
export const responsiveFontSizes = {
  h1: { desktop: '2rem', tablet: '1.5rem', mobile: '1.25rem' },
  h2: { desktop: '1.5rem', tablet: '1.25rem', mobile: '1rem' },
  h3: { desktop: '1.25rem', tablet: '1rem', mobile: '0.875rem' },
  body: { desktop: '1rem', tablet: '0.875rem', mobile: '0.75rem' }
};

// Responsive padding
export const responsivePadding = {
  large: { desktop: '2rem', tablet: '1.5rem', mobile: '1rem' },
  medium: { desktop: '1.5rem', tablet: '1rem', mobile: '0.75rem' },
  small: { desktop: '1rem', tablet: '0.75rem', mobile: '0.5rem' }
};