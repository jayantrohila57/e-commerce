import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { PATH } from '@/shared/config/routes'
import { site } from '@/shared/config/site'
import Link from 'next/link'

export default function HeaderLogo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <h2 className="motion-all font-oswald cursor-pointer text-2xl font-light hover:scale-[.99] active:scale-[.97]">
            <Link
              href={PATH.ROOT}
              aria-label={site.name}
              title={site.name}
            >
              {site.name}
            </Link>
          </h2>
        </TooltipTrigger>
        <TooltipContent>
          <p> {site.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
