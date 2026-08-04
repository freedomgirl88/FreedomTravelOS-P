import { MonitorSmartphone, Moon, Sun } from "lucide-react";

const options = [
  ["light", "Light", Sun],
  ["dark", "Dark", Moon],
  ["system", "System", MonitorSmartphone]
];

export default function ThemeSelector({ theme, setTheme }) {
  return <div className="theme-segment" role="group" aria-label="Theme selector">
    {options.map(([value, label, Icon]) => <button key={value} className={theme === value ? "active" : ""} onClick={() => { setTheme(value); window.ftosToast?.(`${label} theme selected`); }}><Icon size={16}/><span>{label}</span></button>)}
  </div>;
}
