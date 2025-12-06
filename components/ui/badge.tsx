import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        common: 'border-transparent bg-rarity-common/20 text-rarity-common',
        uncommon: 'border-transparent bg-rarity-uncommon/20 text-rarity-uncommon',
        rare: 'border-transparent bg-rarity-rare/20 text-rarity-rare',
        epic: 'border-transparent bg-rarity-epic/20 text-rarity-epic',
        legendary: 'border-transparent bg-rarity-legendary/20 text-rarity-legendary',
        mythic: 'border-transparent bg-rarity-mythic/20 text-rarity-mythic',
        pokemon: 'border-transparent bg-pokemon-red/20 text-pokemon-red',
        mtg: 'border-transparent bg-mtg-blue/20 text-mtg-blue',
        sports: 'border-transparent bg-sports-gold/20 text-sports-gold',
        psa: 'border-transparent bg-red-500/20 text-red-400',
        bgs: 'border-transparent bg-blue-500/20 text-blue-400',
        cgc: 'border-transparent bg-green-500/20 text-green-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
