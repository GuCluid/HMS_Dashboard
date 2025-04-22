import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Box, 
  Divider, 
  Menu, 
  MenuItem, 
  FormControl, 
  Select, 
  InputLabel,
  Button,
  Avatar,
  Badge,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ErrorIcon from '@material-ui/icons/Error';
import StorageIcon from '@material-ui/icons/Storage';
import SyncIcon from '@material-ui/icons/Sync';
import TimelineIcon from '@material-ui/icons/Timeline';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { useAuth } from '../contexts/AuthContext';

// Import dashboard pages
import Overview from './dashboard/Overview';
import ErrorMonitoring from './dashboard/ErrorMonitoring';
import DatabaseMonitoring from './dashboard/DatabaseMonitoring';
import IntegrationMonitoring from './dashboard/IntegrationMonitoring';
import ActivityMonitoring from './dashboard/ActivityMonitoring';
import Settings from './dashboard/Settings';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
  environmentSelector: {
    margin: theme.spacing(0, 2),
    minWidth: 120,
    '& .MuiOutlinedInput-root': {
      color: 'white',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.5)',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
    '& .MuiSelect-icon': {
      color: 'white',
    },
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    cursor: 'pointer',
  },
  activeListItem: {
    backgroundColor: 'rgba(0, 120, 212, 0.08)',
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    paddingLeft: theme.spacing(2.75),
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiListItemText-primary': {
      fontWeight: 600,
      color: theme.palette.primary.main,
    },
  },
  listItem: {
    borderLeft: '4px solid transparent',
    paddingLeft: theme.spacing(3),
  },
  badge: {
    backgroundColor: theme.palette.error.main,
  },
  environmentLabel: {
    color: 'white',
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
  },
  logo: {
    height: 32,
    marginRight: theme.spacing(1),
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [open, setOpen] = useState(!isMobile);
  const [environment, setEnvironment] = useState('prod');
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
  // Close drawer on mobile by default
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile]);
  
  // Get current path
  const getCurrentPath = () => {
    const path = location.pathname.split('/');
    return path.length > 2 ? path[2] : '';
  };
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  const handleEnvironmentChange = (event) => {
    setEnvironment(event.target.value);
  };
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  
  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleNavigate = (path) => {
    navigate(`/dashboard/${path}`);
    if (isMobile) {
      setOpen(false);
    }
  };
  
  // Menu items
  const menuItems = [
    { text: 'Overview', icon: <DashboardIcon />, path: '' },
    { text: 'Error Monitoring', icon: <ErrorIcon />, path: 'errors' },
    { text: 'Database Monitoring', icon: <StorageIcon />, path: 'database' },
    { text: 'Integration Monitoring', icon: <SyncIcon />, path: 'integrations' },
    { text: 'Activity Monitoring', icon: <TimelineIcon />, path: 'activities' },
    { text: 'Settings', icon: <SettingsIcon />, path: 'settings' },
  ];
  
  // Get environment details
  const getEnvironmentDetails = () => {
    const environments = {
      prod: {
        name: 'Production',
        url: 'https://cluid-prod.crm4.dynamics.com/'
      },
      preprod: {
        name: 'Preprod',
        url: 'https://cluid-preprod.crm4.dynamics.com/'
      },
      uat: {
        name: 'UAT',
        url: 'https://cluid-uat.crm4.dynamics.com/'
      }
    };
    
    return environments[environment] || environments.prod;
  };
  
  const environmentDetails = getEnvironmentDetails();
  
  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={classes.appBar}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={!open ? classes.menuButton : classes.hide}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.title}>
            Dynamics 365 Monitor
          </Typography>
          
          <Typography variant="body2" className={classes.environmentLabel}>
            Environment:
          </Typography>
          
          <FormControl variant="outlined" size="small" className={classes.environmentSelector}>
            <Select
              value={environment}
              onChange={handleEnvironmentChange}
              inputProps={{
                name: 'environment',
                id: 'environment-selector',
              }}
            >
              <MenuItem value="prod">Production</MenuItem>
              <MenuItem value="preprod">Preprod</MenuItem>
              <MenuItem value="uat">UAT</MenuItem>
            </Select>
          </FormControl>
          
          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={handleNotificationMenuOpen}>
              <Badge badgeContent={3} classes={{ badge: classes.badge }}>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Account">
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar className={classes.avatar}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="permanent"
        className={open ? classes.drawerOpen : classes.drawerClose}
        classes={{
          paper: open ? classes.drawerOpen : classes.drawerClose,
        }}
      >
        <div className={classes.drawerHeader}>
          <div className={classes.logoContainer}>
            <img 
              src="https://static.cdnlogo.com/logos/m/25/microsoft-dynamics-365.svg" 
              alt="Dynamics 365 Logo" 
              className={classes.logo} 
            />
            {open && <Typography variant="h6">Monitor</Typography>}
          </div>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => handleNavigate(item.path)}
              className={getCurrentPath() === item.path ? classes.activeListItem : classes.listItem}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem button onClick={handleLogout} className={classes.listItem}>
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
      
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Routes>
          <Route path="" element={<Overview environment={environment} />} />
          <Route path="errors" element={<ErrorMonitoring environment={environment} />} />
          <Route path="database" element={<DatabaseMonitoring environment={environment} />} />
          <Route path="integrations" element={<IntegrationMonitoring environment={environment} />} />
          <Route path="activities" element={<ActivityMonitoring environment={environment} />} />
          <Route path="settings" element={<Settings environment={environment} />} />
        </Routes>
      </main>
      
      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>My account</MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        keepMounted
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
      >
        <MenuItem onClick={handleNotificationMenuClose}>
          <Typography variant="subtitle2">Error rate increased by 15%</Typography>
        </MenuItem>
        <MenuItem onClick={handleNotificationMenuClose}>
          <Typography variant="subtitle2">Database performance degraded</Typography>
        </MenuItem>
        <MenuItem onClick={handleNotificationMenuClose}>
          <Typography variant="subtitle2">DocuSign integration issue detected</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleNotificationMenuClose}>
          <Typography variant="body2" color="primary">View all notifications</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Dashboard;
