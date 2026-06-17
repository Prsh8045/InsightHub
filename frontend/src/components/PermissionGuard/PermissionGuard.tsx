import { ReactNode } from "react";

interface Props {
  role: string;
  allowedRoles: string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export default function PermissionGuard({
  role,
  allowedRoles,
  fallback = null,
  children,
}: Props) {
  if (!allowedRoles.includes(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
