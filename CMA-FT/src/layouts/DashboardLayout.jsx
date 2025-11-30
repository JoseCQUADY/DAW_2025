import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EngineeringIcon from '@mui/icons-material/Engineering';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import { useTheme } from '@mui/material/styles';
import logo from '../assets/logo.svg';

const drawerWidth = 280;

const navLinks = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon />, adminOnly: false },
    { text: 'Equipos', path: '/equipos', icon: <EngineeringIcon />, adminOnly: false },
    { text: 'Usuarios', path: '/admin/usuarios', icon: <GroupIcon />, adminOnly: true },
];

const DashboardLayout = (props) => {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user, logout } = useAuth();
    const { toggleTheme } = useThemeMode();
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const handleMobileDrawerToggle = () => setMobileOpen(!mobileOpen);
    const handleSidebarToggle = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    
    const getInitials = (name = '') => name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '';

    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box>
                <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, gap: 1 }}>
                    <img src={logo} alt="Logo" style={{ height: '32px', filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : '' }} />
                    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
                        Bitácora CMA
                    </Typography>
                </Toolbar>
                <Divider />
                <List sx={{ p: 2 }}>
                    {navLinks.filter(link => !link.adminOnly || user.rol === 'ADMIN').map((link) => (
                        <ListItem key={link.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                component={Link}
                                to={link.path}
                                selected={location.pathname.startsWith(link.path)}
                                sx={{ borderRadius: 2, '&.Mui-selected': { backgroundColor: 'action.selected', boxShadow: 3 } }}
                            >
                                <ListItemIcon sx={{ minWidth: 'auto', mr: 2, p: 1, borderRadius: 2, backgroundColor: location.pathname.startsWith(link.path) ? 'primary.main' : 'transparent', color: location.pathname.startsWith(link.path) ? 'white' : 'inherit' }}>
                                    {link.icon}
                                </ListItemIcon>
                                <ListItemText primary={link.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ p: 2 }}>
                <Divider sx={{ mb: 2 }} />
                <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
                    <ListItemIcon><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Cerrar Sesión" />
                </ListItemButton>
            </Box>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;
    const finalDrawerWidth = isSidebarOpen ? drawerWidth : 0;

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" elevation={0} sx={{ 
                width: { md: `calc(100% - ${finalDrawerWidth}px)` }, 
                ml: { md: `${finalDrawerWidth}px` },
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                boxShadow: 'none',
                color: 'text.primary',
                borderBottom: '1px solid',
                borderColor: 'divider',
                [theme.breakpoints.up('md')]: {
                    ...(isSidebarOpen && {
                        width: `calc(100% - ${drawerWidth}px)`,
                        marginLeft: `${drawerWidth}px`,
                        transition: theme.transitions.create(['margin', 'width'], {
                            easing: theme.transitions.easing.easeOut,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    }),
                },
            }}>
                <Toolbar>
                    <IconButton color="inherit" onClick={handleMobileDrawerToggle} sx={{ mr: 2, display: { md: 'none' } }}>
                        <MenuIcon />
                    </IconButton>
                    <IconButton color="inherit" onClick={handleSidebarToggle} sx={{ mr: 2, display: { xs: 'none', md: 'block' } }}>
                        {isSidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <Tooltip title="Cambiar Tema">
                        <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
                            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                    </Tooltip>
                    <Avatar sx={{ bgcolor: 'secondary.main', color: 'primary.main', ml: 2 }}>
                        {getInitials(user.nombre)}
                    </Avatar>
                </Toolbar>
            </AppBar>

            <Box component="nav" sx={{ width: { md: finalDrawerWidth }, flexShrink: { md: 0 }, transition: theme.transitions.create('width', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen }) }}>
                <Drawer
                    container={container} variant="temporary" open={mobileOpen} onClose={handleMobileDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
                >
                    {drawerContent}
                </Drawer>
                <Drawer
                    variant="persistent"
                    sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
                    open={isSidebarOpen}
                >
                    {drawerContent}
                </Drawer>
            </Box>

            <Box component="main" sx={{ 
                flexGrow: 1, 
                p: 3, 
                width: { md: `calc(100% - ${finalDrawerWidth}px)` },
                ml: { md: `-${drawerWidth}px` },
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                ...(isSidebarOpen && {
                     [theme.breakpoints.up('md')]: {
                        transition: theme.transitions.create('margin', {
                            easing: theme.transitions.easing.easeOut,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                        marginLeft: 0,
                     }
                }),
            }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;