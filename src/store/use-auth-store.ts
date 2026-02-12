import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    unlockedMessages: Record<string, string>;
    unlockShare: (id: string, message: string) => void;
    getUnlockedMessage: (id: string) => string | undefined;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            unlockedMessages: {},
            unlockShare: (id, message) =>
                set((state) => ({
                    unlockedMessages: {
                        ...state.unlockedMessages,
                        [id]: message,
                    },
                })),
            getUnlockedMessage: (id) => get().unlockedMessages[id],
        }),
        {
            name: 'whisper-note-auth',
        }
    )
);
