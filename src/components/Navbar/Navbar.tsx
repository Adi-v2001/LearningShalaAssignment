'use client';
import { Button } from "../ui/button";
import { useAuth } from "@/Context/UserContext";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <div className="flex items-center justify-between p-4 h-[70px] bg-blue-800 text-white">
      <h1 className="font-semibold text-lg">Content Management</h1>
      {isLoggedIn && (
        <div className="space-x-4">
          <Button className="bg-transparent border border-white hover:bg-blue-600" onClick={logout}>
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
