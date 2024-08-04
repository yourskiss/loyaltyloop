 "use client";
import Link from "next/link";
import Image from 'next/image';
import HeaderFirst from "../shared/HeaderFirst";
import FooterComponent from "../shared/FooterComponent";
export default function NotFoundComponents() {

  return (
    <>
    <HeaderFirst />

    <div className="screenmain"> 
        <div className="screencontainer">

                <div className="pagenotfound">
                  <Image src="/assets/images/notfound.png" width={616} height={500} alt="notfound" quality={100} />
                  <h2>Back to <Link href="/">Back to Home</Link></h2>    
                </div>

        </div>
      </div>

    <FooterComponent />
    </>
  )
}
