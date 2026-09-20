import { getInitials, getAvatarColors, cn } from '@/lib/utils';

export default function Avatar({ name, size = 'md' }) {
  const initials = getInitials(name);
  const colors = getAvatarColors(name);
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-lg',
  };
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-semibold shrink-0',
        colors.bg,
        colors.text,
        sizes[size]
      )}
    >
      {initials}
    </div>
  );
}
