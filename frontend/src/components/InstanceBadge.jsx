export default function InstanceBadge({ port }) {
  if (!port) return null;

  let color = "";
  let bg = "";
  let dot = "";

  if (String(port) === "8081") {
    color = "text-blue-400";
    bg = "bg-blue-500/10";
    dot = "bg-blue-400";
  } else if (String(port) === "8082") {
    color = "text-purple-400";
    bg = "bg-purple-500/10";
    dot = "bg-purple-400";
  } else if (String(port) === "8083") {
    color = "text-[#4f772d]";
    bg = "bg-[#4f772d]/15";
    dot = "bg-[#4f772d]";
  } else {
    color = "text-zinc-400";
    bg = "bg-zinc-700/30";
    dot = "bg-zinc-400";
  }

  return (
    <span
      className={`px-2 py-1 rounded-full flex items-center gap-1 text-xs font-mono ${bg} ${color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse`} />:
      {port}
    </span>
  );
}
