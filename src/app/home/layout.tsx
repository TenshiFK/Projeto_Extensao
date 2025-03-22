'use client';
import { useAuthState } from "react-firebase-hooks/auth";
import SideNav from "../components/SideNav";
import { auth } from "@/app/firebase/firebaseconfig";
import { useRouter } from "next/navigation";

 
export default function Layout({ children }: { children: React.ReactNode }) {

  const [user] = useAuthState(auth); //para autenticações, serve para prevenir usuarios não logados de ver a homepage.
  const router = useRouter()
  const userSession = sessionStorage.getItem('user');

  if(!user){
    return router.push('/')
  }

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav/>
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:py-20 md:px-15">{children}</div>
    </div>
  );
}