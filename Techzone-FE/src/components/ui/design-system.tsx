


export const DESIGN_TOKENS = {
  colors: {
    primary: '#2C8B3D',      
    secondary: '#88C140',    
    accent: '#F2A024',       
    background: '#FDFDFD',   
    surface: '#FFFFFF',      
    text: {
      primary: '#1F2937',    
      secondary: '#6B7280',  
      light: '#9CA3AF',      
      inverse: '#FFFFFF',    
    },
    border: '#E5E7EB',       
    error: '#EF4444',        
    success: '#10B981',      
    warning: '#F59E0B',      
    info: '#3B82F6',         
    disabled: '#D1D5DB',     
  },
  spacing: {
    xs: '0.25rem',   
    sm: '0.5rem',    
    md: '1rem',      
    lg: '1.5rem',    
    xl: '2rem',      
    '2xl': '3rem',   
  },
  borderRadius: {
    sm: '0.375rem',  
    md: '0.5rem',    
    lg: '0.75rem',   
    xl: '1rem',      
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};


export const STYLE_CLASSES = {
  
  card: 'bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden',
  cardHover: 'hover:shadow-lg transition-shadow duration-200',
  
  
  buttonBase: 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
  buttonPrimary: 'bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg',
  buttonSecondary: 'bg-secondary hover:bg-secondary/90 text-white',
  buttonOutline: 'border-2 border-primary text-primary hover:bg-primary/10',
  buttonGhost: 'text-primary hover:bg-primary/10',
  buttonDanger: 'bg-error hover:bg-error/90 text-white',
  
  
  input: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors',
  inputError: 'border-error focus:ring-error/50 focus:border-error',
  
  
  formLabel: 'block text-sm font-medium text-gray-700 mb-2',
  formError: 'text-sm text-error mt-1',
  formHelper: 'text-sm text-gray-500 mt-1',
  
  
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  pageTitle: 'text-3xl font-bold text-gray-900 mb-8',
  sectionTitle: 'text-xl font-semibold text-gray-900 mb-4',
  
  
  badge: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
  badgePrimary: 'bg-primary/10 text-primary',
  badgeSuccess: 'bg-success/10 text-success',
  badgeWarning: 'bg-warning/10 text-warning',
  badgeError: 'bg-error/10 text-error',
  
  
  gridResponsive: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
  gridTwoCol: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
  
  
  textBase: 'text-base leading-6 text-gray-700',
  textSmall: 'text-sm leading-5 text-gray-600',
  textMuted: 'text-gray-500',
  
  
  divider: 'border-t border-gray-200',
};
