import { cn } from '@/shared/utils/cn'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: AvatarSize
  className?: string
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function Avatar({ src, alt, name, size = 'md', className }: AvatarProps) {
  const initials = name ? getInitials(name) : '?'

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-full)]',
        'bg-[var(--color-primary-100)] font-medium text-[var(--color-primary-700)]',
        sizeStyles[size],
        className,
      )}
      aria-label={alt ?? name}
    >
      {src ? (
        <img src={src} alt={alt ?? name ?? 'Avatar'} className="h-full w-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}
