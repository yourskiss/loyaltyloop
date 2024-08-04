import { Suspense} from 'react';
import RegistationComponent from "@/components/app/RegistationComponent";
export default function registation() {
    return (
        <Suspense fallback={<p>...Loading</p>}>
            <RegistationComponent />
        </Suspense>
    )
  }
