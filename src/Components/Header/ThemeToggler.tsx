import { Moon, Sun } from "lucide-react";

const ThemeController = () => {
  return (
    <div className="btn btn-ghost mx-2">
      <label className="swap swap-rotate">
        <input type="checkbox" className="theme-controller" value="valentine" />

        {/* sun icon */}
        <Sun className="swap-off" size={30} />
        {/* Moon Icon */}
        <Moon className="swap-on" size={30} />
      </label>
    </div>
  );
};

export default ThemeController;
