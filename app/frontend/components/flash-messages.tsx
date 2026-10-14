import { router, usePage } from '@inertiajs/react'
import { CircleAlert, CircleCheck, Undo2 } from 'lucide-react'

import { Alert, AlertAction, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export function FlashMessages() {
  const { flash } = usePage()

  if (!flash.notice && !flash.alert) return null

  return (
    <div className="mb-4 flex flex-col gap-2">
      {flash.notice && (
        <Alert>
          <CircleCheck />
          <AlertDescription>{flash.notice}</AlertDescription>
          {flash.undo && (
            <AlertAction>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.patch(flash.undo!, {}, { preserveScroll: true })
                }
              >
                <Undo2 />
                Deshacer
              </Button>
            </AlertAction>
          )}
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
