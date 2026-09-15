import logo from "/logo.png";
import Button from "./button";
export default function Navbar() {
  return (
    <nav className="bg-surface-container-lowest flex justify-between items-center px-3 mx-auto">
      <div>
        <img src={logo} alt="pharma logo" />
      </div>
      <div>
        <Button variant="primary">Admin</Button>
      </div>
    </nav>
  );
}
