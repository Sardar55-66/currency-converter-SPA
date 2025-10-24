import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';
import type { AlertColor } from '@mui/material';

interface ToastContextType {
    showToast: (message: string, severity?: AlertColor) => void;
    showError: (message: string) => void;
    showSuccess: (message: string) => void;
    showWarning: (message: string) => void;
    showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<AlertColor>('info');

    const showToast = useCallback((newMessage: string, newSeverity: AlertColor = 'info') => {
        setMessage(newMessage);
        setSeverity(newSeverity);
        setOpen(true);
    }, []);

    const showError = useCallback((newMessage: string) => {
        showToast(newMessage, 'error');
    }, [showToast]);

    const showSuccess = useCallback((newMessage: string) => {
        showToast(newMessage, 'success');
    }, [showToast]);

    const showWarning = useCallback((newMessage: string) => {
        showToast(newMessage, 'warning');
    }, [showToast]);

    const showInfo = useCallback((newMessage: string) => {
        showToast(newMessage, 'info');
    }, [showToast]);

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <ToastContext.Provider value={{ showToast, showError, showSuccess, showWarning, showInfo }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={1800}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{ mt: 2 }}
            >
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
};
