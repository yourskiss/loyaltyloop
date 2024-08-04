import { Suspense} from 'react';
import EarnedComponent from '@/components/app/EarnedComponent'
export default function Earnedpoint() {
  return (
    <Suspense fallback={<p>...Loading</p>}>
      <EarnedComponent />
    </Suspense>
  )
}
