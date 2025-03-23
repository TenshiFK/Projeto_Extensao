import SideNav from "../components/SideNav";
import PrivateRoute from "../components/private/PrivateRoute";

 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PrivateRoute>
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav/>
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:py-20 md:px-15">{children}</div>
    </div>
    </PrivateRoute>
  );
}