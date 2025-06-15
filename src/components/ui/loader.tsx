
import { Loader2 } from "lucide-react";

const Loader = ({ label = "Loading..." }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-8 animate-fade-in">
    <Loader2 className="animate-spin text-primary" size={34} />
    <span className="text-muted-foreground text-sm">{label}</span>
  </div>
);

export default Loader;
