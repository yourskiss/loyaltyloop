 
import Image from 'next/image'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Walkthrough() {
  var settingsWalkthrough = {
    dots: true,
    arrows:false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };


  return (
 
    <div className="walkthrough">
        <div className="walkthroughInner">
          <div className='walkthroughContainer'>
                            <Slider className="wt_slider" {...settingsWalkthrough}>
                                <div className="wt_item">
                                    <Image src="/assets/images/product-categories/pc1.jpg" width={100} height={100} alt="product" quality={99} />
                                </div>
                                <div className="wt_item">
                                    <Image src="/assets/images/product-categories/pc2.png" width={100} height={100} alt="product" quality={99} />
                                </div>
                                <div className="wt_item">
                                    <Image src="/assets/images/product-categories/pc3.png" width={100} height={100} alt="product" quality={99} />
                                </div>
                                <div className="wt_item">
                                    <Image src="/assets/images/product-categories/pc4.jpg" width={100} height={100} alt="product" quality={99} />
                                </div>
                            </Slider>
            <h2>lorem ipsum dolor sit amet</h2>
            <h3>consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</h3>
          </div>
        </div>
        <aside>Skip</aside>
    </div>
 
  )
}
