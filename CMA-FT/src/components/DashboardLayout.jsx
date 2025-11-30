import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import {
    Box, Drawer, AppBar, Toolbar, List, Typography, Divider,
    IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Avatar, Menu, MenuItem, Tooltip, useMediaQuery, Fade, alpha
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import logo from '../assets/logo.svg';

import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DevicesIcon from '@mui/icons-material/Devices';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const drawerWidth = 260;

const DashboardLayout = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { toggleTheme, isDarkMode } = useThemeMode();

    // Detectamos si es móvil
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Estado SOLO para controlar el menú en móvil. 
    // En escritorio ignoraremos esto y siempre estará abierto.
    const [mobileOpen, setMobileOpen] = useState(false);

    const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
    const [pageReady, setPageReady] = useState(false);

    useEffect(() => {
        setPageReady(false);
        const timer = setTimeout(() => setPageReady(true), 0);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event) => setProfileMenuAnchor(event.currentTarget);
    const handleProfileMenuClose = () => setProfileMenuAnchor(null);

    const handleLogout = async () => {
        await logout();
        handleProfileMenuClose();
        navigate('/login');
    };

    const handleNavigate = (path) => {
        navigate(path);
        if (isMobile) setMobileOpen(false);
    };

    const getInitials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon />, show: true },
        { label: 'Equipos', path: '/equipos', icon: <DevicesIcon />, show: true },
        { label: 'Usuarios', path: '/admin/usuarios', icon: <PeopleIcon />, show: user?.rol === 'ADMIN' },
    ];

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    ...theme.mixins.toolbar,
                }}
            >
                <Box component={Link} to="/dashboard" sx={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{
                            height: '32px',
                            filter: isDarkMode ? 'brightness(0) invert(1)' : 'none',
                        }}
                    />
                </Box>
                {isMobile && (
                    <IconButton onClick={handleDrawerToggle}>
                        <ChevronLeftIcon />
                    </IconButton>
                )}
            </Box>

            <Divider />

            {user && (
                <Box sx={{ p: 2 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.primary.main, isDarkMode ? 0.15 : 0.08)
                        }}
                    >
                        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontWeight: 600 }}>
                            {getInitials(user.nombre)}
                        </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>{user.nombre}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{user.rol}</Typography>
                        </Box>
                    </Box>
                </Box>
            )}

            <Divider />

            <List sx={{ px: 1, py: 2, flex: 1 }}>
                {navItems.filter(item => item.show).map((item) => (
                    <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            onClick={() => handleNavigate(item.path)}
                            selected={isActive(item.path)}
                            sx={{
                                borderRadius: 2,
                                '&.Mui-selected': {
                                    bgcolor: alpha(theme.palette.primary.main, isDarkMode ? 0.2 : 0.12),
                                    color: 'primary.main',
                                    '& .MuiListItemIcon-root': { color: 'primary.main' }
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider />

            <List sx={{ px: 1, pb: 2 }}>
                <ListItem disablePadding>
                    <ListItemButton onClick={toggleTheme} sx={{ borderRadius: 2 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>{isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}</ListItemIcon>
                        <ListItemText primary={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: 'error.main' }}>
                        <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}><LogoutIcon /></ListItemIcon>
                        <ListItemText primary="Cerrar Sesión" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    width: { md: `calc(100% - ${drawerWidth}px)` }, // En MD+ resta el sidebar
                    ml: { md: `${drawerWidth}px` }, // En MD+ empuja a la derecha
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }} // Oculto en escritorio
                    >
                        <MenuIcon />
                    </IconButton>

                    {isMobile && !mobileOpen && (
                        <img src={logo} alt="Logo" style={{ height: 28, filter: isDarkMode ? 'brightness(0) invert(1)' : 'none' }} />
                    )}

                    <Box sx={{ flexGrow: 1 }} />
                    {/* Aqui falta reparar el handler para poder abrirlo con su nombre (pendiende MVP)*/}
                    <Tooltip title="Perfil">
                        <IconButton>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                {getInitials(user?.nombre)}
                            </Avatar>
                        </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={profileMenuAnchor}
                        open={Boolean(profileMenuAnchor)}
                        onClose={handleProfileMenuClose}
                        sx={{ mt: '45px' }}
                    >
                        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                            <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                            Cerrar Sesión
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawerContent}
                </Drawer>

                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            borderRight: '1px solid',
                            borderColor: 'divider'
                        },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    minWidth: 0,
                    minHeight: '100vh',
                    bgcolor: 'background.default'
                }}
            >
                <Toolbar />
                <Fade in={pageReady} timeout={400}>
                    <Box>
                        <Outlet />
                    </Box>
                </Fade>
            </Box>
        </Box>
    );
};

export default DashboardLayout;