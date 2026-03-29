import { useEffect, useState } from "react";
import { todoApi } from "../api/todoApi";

export default function ActuatorPanel() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    todoApi
      .getHealth()
      .then((res) => setHealth(res.data))
      .catch(() => setHealth(null));
  }, []);

  if (!health) {
    return (
      <div className="glass-card p-4 text-zinc-500 text-sm">
        Loading actuator...
      </div>
    );
  }

  const discovery = health.components?.discoveryComposite?.components;
  const services = discovery?.discoveryClient?.details?.services || [];
  const instances = discovery?.eureka?.details?.applications || {};

  return (
    <div className="glass-card p-4">
      <h3 className="text-xs font-mono text-zinc-400 uppercase mb-3">
        Actuator Health
      </h3>

      {/* Overall status */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-zinc-300">Status</span>
        <span
          className={`text-xs font-mono px-2 py-1 rounded 
          ${health.status === "UP" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}
        >
          {health.status}
        </span>
      </div>

      {/* Services */}
      <div className="mb-3">
        <p className="text-xs text-zinc-500 mb-1">Services</p>
        {services.map((s, i) => (
          <p key={i} className="text-xs text-zinc-300">
            • {s}
          </p>
        ))}
      </div>

      {/* Instances */}
      <div>
        <p className="text-xs text-zinc-500 mb-1">Instances</p>
        {Object.entries(instances).map(([key, val]) => (
          <div key={key} className="flex justify-between text-xs text-zinc-300">
            <span>{key}</span>
            <span>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
