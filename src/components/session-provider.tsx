"use client";

import React, { createContext, useContext } from "react";
import { SessionUser, SessionAdmin } from "@/lib/session";

type Session = SessionUser | SessionAdmin | null;

const SessionContext = createContext<Session | undefined>(undefined);

export function SessionProvider({ children, session }: { children: React.ReactNode, session: Session }) {
    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
}
