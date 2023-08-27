import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // for moon icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // for sun icon


interface AppBarProps {
    toggleTheme: () => void;
    theme:string;
}

const AppBar: React.FC<AppBarProps> = ({ toggleTheme, theme }) => {
    return (
        <MuiAppBar position="static" style={{ backgroundColor: '#d71921', borderBottom: '2px solid yellow' }}>
            <Toolbar className="justify-between">
            <Typography variant="h6">Chat Interface</Typography>
                <img src="/higgs.png" alt="Logo" className="w-72 h-auto" />
               
                <IconButton onClick={toggleTheme}>
                    {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                </IconButton>
            </Toolbar>
        </MuiAppBar>
    );
};

export default AppBar;
