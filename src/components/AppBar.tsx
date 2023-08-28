import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

interface AppBarProps {
    toggleTheme: () => void;
    theme: string;
}

const AppBar: React.FC<AppBarProps> = ({ toggleTheme, theme }) => {
    return (
        <MuiAppBar position="static" style={{ backgroundColor: '#d71921', borderBottom: '2px solid yellow' }}>
            <Toolbar className="justify-between">
                <Typography variant="h6">Chat Interface</Typography>
                <img src="/higgs.png" alt="Logo" className="w-72 h-auto" />
                <IconButton onClick={toggleTheme}>
                    {theme === 'dark' ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
                </IconButton>
            </Toolbar>
        </MuiAppBar>
    );
};

export default AppBar;
