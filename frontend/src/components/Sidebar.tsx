import { sidebarConfig } from "../config/sidebarConfig";
import { useAuth } from "../context/AuthContext";

type Props = {
  active: string;
  setActive: (val: string) => void;
};

export default function Sidebar({ active, setActive }: Props) {
  const { user } = useAuth();

  if (!user) return null;

  const menuItems = sidebarConfig[user.role];

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 text-xl font-bold border-b capitalize">
        {user.role} Panel
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`flex items-center gap-3 w-full p-3 rounded-xl transition hover:cursor-pointer ${
                active === item.name
                  ? "bg-black text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
}