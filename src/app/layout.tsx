'use client';
import "./assets/styles/global.css";
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./contexts/authContext";
import { ToastContainer } from "react-toastify";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <AuthProvider>
          {children}
          <ToastContainer 
          position="top-center"/>
        </AuthProvider>
      </body>
    </html>
  );
}
