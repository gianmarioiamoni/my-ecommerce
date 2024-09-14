import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Button } from '@mui/material';

const Success = () => {
    const { t } = useTranslation();

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                {t('success.title')}
            </Typography>
            <Typography variant="body1" gutterBottom>
                {t('success.message')}
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/">
                {t('success.backHome')}
            </Button>
        </Container>
    );
};

export default Success;

