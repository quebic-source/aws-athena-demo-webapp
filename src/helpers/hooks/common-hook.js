import React, { useContext } from "react";
import { useLocation, useParams } from "react-router";
import { AppContext } from "../../context/app-context";

export function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export function useAppInfo() {
    const { appId, version, intent } = useParams();
    return { appId, version, intent };
}

export function useAppContext() {
    const context = useContext(AppContext);
    return context;
}
