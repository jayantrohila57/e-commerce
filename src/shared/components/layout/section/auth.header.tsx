import GoBackButton from '../../common/go-back'
import { Breadcrumbs } from '../breadcrumb/breadcrumbs'

export const SubNavHeader = () => {
  return (
    <div className="flex flex-row items-center justify-start gap-4 py-4">
      <GoBackButton />
      <Breadcrumbs className="text-lg" />
    </div>
  )
}
