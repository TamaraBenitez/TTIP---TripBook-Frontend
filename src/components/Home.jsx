import React, { useState } from 'react';
import { Box, Button, TextField, Container } from '@mui/material';

const Home = () => {
  const [isSearchClicked, setIsSearchClicked] = useState(false);

  const handleSearch = () => {
    // Trigger transition to move the search box and buttons to the header
    setIsSearchClicked(true);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(../assets/road.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isSearchClicked ? 'flex-start' : 'center',
        transition: 'all 0.5s ease',
      }}
    >
      

      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'all 0.5s ease',
          mt: isSearchClicked ? '100px' : 0,
        }}
      >
        <TextField
          placeholder="Search..."
          variant="outlined"
          sx={{ width: '300px', marginBottom: '20px' }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        {!isSearchClicked && (
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        )}
      </Container>
    </Box>
  );
};

export default Home;