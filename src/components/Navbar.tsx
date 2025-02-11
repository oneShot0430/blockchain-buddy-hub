
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { WalletConnect } from "@/components/WalletConnect";

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  currentPath: string;
}

export const Navbar = ({ isDarkMode, toggleTheme, currentPath }: NavbarProps) => {
  return (
    <nav className="bg-white dark:bg-background/95 shadow dark:shadow-gray-800">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">ZEX BRIDGE</h1>
            </div>
            <div className="hidden sm:flex sm:space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 ${
                  currentPath === "/" 
                    ? "text-gray-900 dark:text-white font-medium"
                    : "text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/trading"
                className={`px-3 py-2 ${
                  currentPath === "/trading"
                    ? "text-gray-900 dark:text-white font-medium"
                    : "text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Trading
              </Link>
              <Link
                to="/roadmap"
                className={`px-3 py-2 ${
                  currentPath === "/roadmap"
                    ? "text-gray-900 dark:text-white font-medium"
                    : "text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Roadmap
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
};
