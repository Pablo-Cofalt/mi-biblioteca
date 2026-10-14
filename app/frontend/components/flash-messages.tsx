import { usePage } from '@inertiajs/react'
import { CircleAlert, CircleCheck } from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'

export function FlashMessages() {
  const { flash } = usePage()

  if (!flash.notice && !flash.alert) return null

  return (
    <div className="mb-4 flex flex-col gap-2">
      {flash.notice && (
        <Alert>
          <CircleCheck />
          <AlertDescription>{flash.notice}</AlertDescription>
        </Alert>
      )}
      {flash.alert && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertDescription>{flash.alert}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
