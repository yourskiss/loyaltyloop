import { Suspense} from 'react';
import ProfileComponent from "@/components/app/ProfileComponent";
export default function profile() {
  return (
    <Suspense fallback={<p>...Loading</p>}>
      <ProfileComponent />
    </Suspense>
)
}
