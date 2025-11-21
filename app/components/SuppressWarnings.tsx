"use client";

import { useEffect } from "react";

export default function SuppressWarnings() {
    useEffect(() => {
        const originalWarn = console.warn;
        console.warn = function (...args: any[]) {
            if (args[0]?.includes?.("Attempting to parse an unsupported color")) {
                return;
            }
            originalWarn.apply(console, args);
        };

        return () => {
            console.warn = originalWarn;
        };
    }, []);

    return null;
}
