interface BadgeProps {
  label: string
  colorClass: string
  small?: boolean
}

export default function Badge({ label, colorClass, small = false }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full font-medium ${colorClass} ${
        small ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'
      }`}
    >
      {label}
    </span>
  )
}
