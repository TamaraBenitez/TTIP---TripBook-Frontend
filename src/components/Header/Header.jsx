import { AppBar, Toolbar, Button } from '@mui/material'
import React from 'react'

export default function Header() {
  return (
    <>
    <AppBar position="fixed" sx={{ backgroundColor: 'primary', boxShadow: 'none' }}>
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            transition: 'all 0.5s ease',
          }}
        >
          <Button variant='contained' >Button 1</Button>
          <Button variant='contained' >Button 2</Button>
        </Toolbar>
      </AppBar>
    </>
  )
}
