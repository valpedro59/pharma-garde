import logo from "/logo.jpeg";
import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="bg-surface-container-lowest w-full">
      <div className="max-w-7xl flex justify-between items-center px-3 mx-auto">
        <div>
          <img
            src={logo}
            width={220}
            height={100}
            className="object-cover"
            alt="pharma logo"
          />
        </div>
        <div>
          <Link
            className="bg-emerald-900 text-on-primary hover:bg-emerald-700/90 px-4 py-2 text-body-md min-h-[44px] inline-flex items-center justify-center font-semibold rounded-btn btn-interaction select-none cursor-pointer disabled:bg-disabled-bg disabled:text-disabled-text disabled:cursor-not-allowed"
            to="/auth"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
