import { router } from '@inertiajs/react'
import { LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function LogoutButton() {
  return (
    <Button variant="ghost" size="sm" onClick={() => router.delete('/session')}>
      <LogOut />
      Salir
    </Button>
  )
}
