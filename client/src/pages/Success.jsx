import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Button } from '@mui/material';

/**
 * A page that displays a message after a successful action
 * @component
 * @returns {React.ReactElement} The JSX element for the success page
 */
const Success = () => {
    const { t } = useTranslation();

    return (
        <Container>
            {/* Title */}
            <Typography variant="h4" component="h1" gutterBottom>
                {t('success.title')}
            </Typography>
            {/* Message */}
            <Typography variant="body1" gutterBottom>
                {t('success.message')}
            </Typography>
            {/* Back to Homepage */}
            <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/"
            >
                {t('success.backHome')}
            </Button>
        </Container>
    );
};

export default Success;

