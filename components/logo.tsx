import { cn } from "@/lib/utils";

export const Logo = ({ className, ...props }: React.ComponentProps<"img">) => {
  return (
    <img
      alt="logo"
      className={cn("h-16 w-auto", className)}
      src="/logo1.png"
      // src="/skillbridge_logo.webp"
      {...props}
    />
  );
};
