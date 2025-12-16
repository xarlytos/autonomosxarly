
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'obsidian-onboarding-state';

interface OnboardingState {
    [key: string]: boolean; // key = module name, value = hasSeen
}

export const useOnboarding = (moduleName: string) => {
    const [hasSeen, setHasSeen] = useState<boolean>(true); // Default to true to prevent flash
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // Check local storage on mount
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const state: OnboardingState = stored ? JSON.parse(stored) : {};

            if (!state[moduleName]) {
                // If not seen, wait a moment then start
                setHasSeen(false);
                setTimeout(() => setIsPlaying(true), 1500); // 1.5s delay for initial load
            } else {
                setHasSeen(true);
            }
        } catch (e) {
            console.error('Error reading onboarding state', e);
        }
    }, [moduleName]);

    const completeTour = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const state: OnboardingState = stored ? JSON.parse(stored) : {};

            state[moduleName] = true;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

            setHasSeen(true);
            setIsPlaying(false);
        } catch (e) {
            console.error('Error saving onboarding state', e);
        }
    };

    const skipTour = () => {
        completeTour();
    };

    const restartTour = () => {
        setIsPlaying(true);
    };

    return {
        hasSeen,
        isPlaying,
        completeTour,
        skipTour,
        restartTour
    };
};
