import { cn } from "@/lib/utils";

export const Logo = ({ className, ...props }: React.ComponentProps<"img">) => {
  return (
    <img
      alt="NexaMentor logo"
      className={cn("h-16 w-auto", className)}
      src="/nexamentor-logo.svg"
      {...props}
    />
  );
};

