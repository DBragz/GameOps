import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export function Logo({ size = "md", showTagline = false }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className="flex flex-col">
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          <div className="relative flex items-center justify-center w-8 h-8 bg-primary rounded-md">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-primary-foreground"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2v20M2 12h20" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
        </div>
        <span
          className={`font-bold tracking-tight ${sizeClasses[size]} neon-glow`}
          data-testid="text-logo"
        >
          <span className="text-primary">Game</span>
          <span className="text-foreground">Ops</span>
        </span>
      </motion.div>
      {showTagline && (
        <motion.p
          className="text-xs text-muted-foreground mt-1 tracking-wide uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          Built for the booth. Trusted by the game.
        </motion.p>
      )}
    </div>
  );
}
