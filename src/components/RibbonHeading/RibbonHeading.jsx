import { useTheme } from '@emotion/react';
import { Typography } from '@mui/material';

export default function RibbonHeading({heading, component, variant}) {
    const theme = useTheme();
    const styles = {
        position: 'relative',
        margin: '0 auto 60px',
        padding: '10px 40px',
        textAlign: 'center',
        fontFamily: 'Merriweather',
        backgroundColor: theme.palette.primary.light,
        maxWidth: 'fit-content',
        color: theme.palette.common.white,
        '::before, ::after': {
          content: '""',
          width: '80px',
          height: '100%',
          backgroundColor: theme.palette.primary.main,
          position: 'absolute',
          zIndex: -1,
          top: '20px',
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 25% 50%)',
          backgroundImage: `linear-gradient(45deg, transparent 50%, ${theme.palette.primary.dark} 50%)`,
          backgroundSize: '20px 20px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom right',
        },
        '::before': {
          left: '-60px',
        },
        '::after': {
          right: '-60px',
          transform: 'scaleX(-1)'
        },
      };

  return(
    <Typography sx={styles} component={component} variant={variant}>
        {heading}
    </Typography>
  )
  
}
