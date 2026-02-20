/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const RouterContext = createContext(null);
const ParamsContext = createContext({});

function normalizeHash(hash) {
  if (!hash || hash === "#") return "/";
  const value = hash.replace(/^#/, "");
  return value.startsWith("/") ? value : `/${value}`;
}

function matchPath(pattern, pathname) {
  if (pattern === "*") return { matched: true, params: {} };

  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return { matched: false, params: {} };
  }

  const params = {};

  for (let i = 0; i < patternParts.length; i += 1) {
    const p = patternParts[i];
    const v = pathParts[i];

    if (p.startsWith(":")) {
      params[p.slice(1)] = v;
      continue;
    }

    if (p !== v) {
      return { matched: false, params: {} };
    }
  }

  return { matched: true, params };
}

export function HashRouter({ children }) {
  const [pathname, setPathname] = useState(() => normalizeHash(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setPathname(normalizeHash(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    if (!window.location.hash) {
      window.location.hash = "/";
    }
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (to) => {
    const target = to.startsWith("/") ? to : `/${to}`;
    window.location.hash = target;
  };

  const value = useMemo(() => ({ pathname, navigate }), [pathname]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function Routes({ children }) {
  const router = useContext(RouterContext);

  if (!router) return null;

  const routes = Array.isArray(children) ? children : [children];

  let fallbackRoute = null;

  for (const route of routes) {
    if (!route?.props) continue;

    const { path, element } = route.props;

    if (path === "*") {
      fallbackRoute = { element };
      continue;
    }

    const { matched, params } = matchPath(path || "", router.pathname);

    if (matched) {
      return <ParamsContext.Provider value={params}>{element}</ParamsContext.Provider>;
    }
  }

  if (fallbackRoute) {
    return <ParamsContext.Provider value={{}}>{fallbackRoute.element}</ParamsContext.Provider>;
  }

  return null;
}

export function Route() {
  return null;
}

export function Navigate({ to }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to);
  }, [navigate, to]);

  return null;
}

export function useNavigate() {
  const router = useContext(RouterContext);
  return router?.navigate || (() => {});
}

export function useLocation() {
  const router = useContext(RouterContext);
  return { pathname: router?.pathname || "/" };
}

export function useParams() {
  return useContext(ParamsContext);
}
