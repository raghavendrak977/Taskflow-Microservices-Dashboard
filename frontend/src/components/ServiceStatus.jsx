export default function ServiceStatus({ lastPort }) {
  const services = [
    { name: "Eureka Server", port: "8761", type: "registry" },
    { name: "Client Service", port: "8080", type: "gateway" },
    { name: "Todo Service #1", port: "8081", type: "todo" },
    { name: "Todo Service #2", port: "8082", type: "todo" },
    { name: "Todo Service #3", port: "8083", type: "todo" },
  ];

  const getStatusStyle = (svc) => {
    if (svc.type === "registry") {
      return "bg-amber-400 animate-pulse";
    }

    if (svc.type === "gateway") {
      return "bg-emerald-400 animate-pulse";
    }

    if (svc.type === "todo") {
      if (!lastPort) return "bg-zinc-600";

      if (String(lastPort) === svc.port) {
        if (svc.port === "8081") {
          return "bg-blue-400 animate-pulse shadow-blue-400/50 shadow-md";
        }
        if (svc.port === "8082") {
          return "bg-purple-400 animate-pulse shadow-purple-400/50 shadow-md";
        }
        if (svc.port === "8083") {
          return "bg-[#4f772d] animate-pulse shadow-[0_0_6px_#4f772d]";
        }
      }

      return "bg-zinc-700 opacity-50";
    }

    return "bg-zinc-600";
  };

  return (
    <div className="glass-card p-4">
      <h3 className="text-xs font-mono text-zinc-400 uppercase mb-3">
        Service Mesh
      </h3>

      <div className="space-y-2">
        {services.map((svc) => (
          <div key={svc.port} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${getStatusStyle(svc)}`} />
              <span
                className={`text-xs ${
                  String(lastPort) === svc.port
                    ? "text-white font-medium"
                    : "text-zinc-300"
                }`}
              >
                {svc.name}
              </span>
            </div>
            <span className="text-xs text-zinc-600 font-mono">:{svc.port}</span>
          </div>
        ))}
      </div>

      {/* Architecture */}
      <div className="mt-4 pt-3 border-t border-zinc-800">
        <div className="flex items-center justify-center gap-1 text-xs text-zinc-600 font-mono">
          <span className="px-2 py-1 bg-zinc-800 rounded">React</span>
          <span>→</span>
          <span className="px-2 py-1 bg-zinc-800 text-emerald-400 rounded">
            :8080
          </span>
          <span>→</span>
          <span>Feign/LB</span>
          <span>→</span>

          <div className="flex flex-col gap-1">
            {["8081", "8082", "8083"].map((p) => (
              <span
                key={p}
                className={`px-2 py-0.5 rounded ${
                  lastPort === p
                    ? p === "8081"
                      ? "bg-blue-500/20 text-blue-400"
                      : p === "8082"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-[#4f772d]/20 text-[#4f772d]"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                :{p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
