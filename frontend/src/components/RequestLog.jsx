import InstanceBadge from "./InstanceBadge";

export default function RequestLog({ logs }) {
  if (!logs.length) return null;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-widest">
          Load Balancer Log
        </h3>
        <span className="text-xs text-zinc-600 font-mono">
          {logs.length} requests
        </span>
      </div>

      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {[...logs].reverse().map((log, i) => (
          <div
            key={log.id}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs
              ${
                i === 0
                  ? "bg-zinc-800/80 border border-zinc-700/40"
                  : "bg-zinc-800/30"
              }`}
          >
            <span className="text-zinc-600 font-mono w-5 text-right">
              {logs.length - i}
            </span>
            <span className="text-zinc-400 flex-1">{log.action}</span>
            <InstanceBadge port={log.port} label="port" />
            <span className="text-zinc-600 font-mono">{log.time}</span>
          </div>
        ))}
      </div>

      <PortDistribution logs={logs} />
    </div>
  );
}

function PortDistribution({ logs }) {
  const counts = logs.reduce((acc, l) => {
    acc[l.port] = (acc[l.port] || 0) + 1;
    return acc;
  }, {});

  const ports = Object.entries(counts);
  if (ports.length < 1) return null;

  const total = logs.length;

  return (
    <div className="mt-3 pt-3 border-t border-zinc-800">
      <p className="text-xs text-zinc-500 mb-2 font-mono">Distribution</p>

      <div className="flex gap-2">
        {ports.map(([port, count]) => {
          const pct = Math.round((count / total) * 100);

          let color = "bg-zinc-500";
          let textColor = "text-zinc-400";

          if (port === "8081") {
            color = "bg-blue-500";
            textColor = "text-blue-400";
          } else if (port === "8082") {
            color = "bg-purple-500";
            textColor = "text-purple-400";
          } else if (port === "8083") {
            color = "bg-cyan-500";
            textColor = "text-green-400";
          }

          return (
            <div key={port} className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className={`font-mono ${textColor}`}>:{port}</span>
                <span className="text-zinc-500">{pct}%</span>
              </div>

              <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
