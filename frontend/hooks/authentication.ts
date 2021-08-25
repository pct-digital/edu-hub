import { useKeycloak } from "@react-keycloak/ssr";
import { KeycloakInstance } from "keycloak-js";
import { useMemo } from "react";

export const useIsLoggedIn = (): boolean => {
  const { keycloak } = useKeycloak<KeycloakInstance>();

  const token = keycloak?.token;

  return (!!keycloak?.authenticated ?? false) && !!token;
};

export const useAuth = () => {
  const { keycloak } = useKeycloak<KeycloakInstance>();

  const isAdmin = useMemo(() => {
    const roles = keycloak?.resourceAccess?.hasura?.roles;
    return roles?.includes("admin");
  }, [keycloak]);

  return {
    isAdmin,
  };
};
