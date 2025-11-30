import React from 'react';
import GlassWrapper from './GlassWrapper';

const ScreenWrapper = ({ children, style }) => {
    return (
        <GlassWrapper style={style}>
            {children}
        </GlassWrapper>
    );
};

export default ScreenWrapper;
