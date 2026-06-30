interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-4 w-4 border-[1.5px]",
  md: "h-5 w-5 border-2",
  lg: "h-8 w-8 border-2",
};

export default function Spinner({ size = "md" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-zinc-600 border-t-white ${sizeMap[size]}`}
    />
  );
}
