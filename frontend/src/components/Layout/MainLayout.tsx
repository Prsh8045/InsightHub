import { ReactNode } from "react";
import Navbar from "./Navbar";

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="app-content">{children}</main>
    </div>
  );
}
