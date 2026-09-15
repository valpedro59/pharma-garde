import { type ComponentProps } from "react";

// Définition des variants de style conformes à votre palette
const VARIANTS = {
  primary: "bg-emerald-900 text-on-primary hover:bg-emerald-700/90",
  secondary: "bg-secondary text-on-secondary hover:bg-secondary/90",
  outline:
    "border-2 border-emerald-900 text-emerald-900 hover:bg-emerald-900 hover:text-on-primary",
  ghost: "text-emerald-900 hover:bg-emerald-200",
  danger:
    "bg-error-container text-on-error-container hover:bg-error-container/50",
};

const SIZES = {
  sm: "px-3 py-1.5 text-body-sm min-h-[38px]",
  md: "px-4 py-2 text-body-md min-h-[44px]", // Idéal pour le touch-friendly sur mobile
  lg: "px-6 py-3 text-body-lg min-h-[52px]",
};

// Extension des propriétés natives du bouton HTML
interface ButtonProps extends ComponentProps<"button"> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  // Assemblage des classes Tailwind v4
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-btn btn-interaction select-none cursor-pointer disabled:bg-disabled-bg disabled:text-disabled-text disabled:cursor-not-allowed";
  const variantStyles = VARIANTS[variant];
  const sizeStyles = SIZES[size];

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {/* Indicateur de chargement (Spinner) */}
      {isLoading && (
        <span className="mr-2 animate-spin border-2 border-current border-t-transparent rounded-full w-4 height-4" />
      )}

      {/* Icône optionnelle (ex: FontAwesome) */}
      {!isLoading && icon && <span className="inline-flex mr-2">{icon}</span>}

      {/* Texte du bouton */}
      <span>{children}</span>
    </button>
  );
}
