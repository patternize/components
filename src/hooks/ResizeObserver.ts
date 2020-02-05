/*
    This custom hook handles Window Resize Events
 */
import * as React from 'react';

// use polyfill, because not every browser supports ResizeObserver
import ResizeObserver from "resize-observer-polyfill";

const { useState, useEffect } = React;

export const useResizeObserver = ref => {
    const [dimensions, setDimensions] = useState(null as any);
    useEffect(() => {
        const observeTarget = ref.current;
        const resizeObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                setDimensions(entry.contentRect as any);
            });
        });
        resizeObserver.observe(observeTarget);
        return () => {
            resizeObserver.unobserve(observeTarget);
        };
    }, [ref]);
    return dimensions;
};
