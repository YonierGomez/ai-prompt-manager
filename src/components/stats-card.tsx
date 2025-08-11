'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: number
  icon: ReactNode
  trend?: string
  description?: string
}

export function StatsCard({ title, value, icon, trend, description }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {title}
          </CardTitle>
          <div className="text-muted-foreground">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value.toLocaleString()}</div>
          {trend && (
            <p className="text-xs text-muted-foreground">
              <span className={trend.startsWith('+') ? 'text-green-600' : 'text-muted-foreground'}>
                {trend}
              </span>
              {description && ` ${description}`}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
