import React from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';


const PromoCarousel =()=>{
    const settings={
        dots:true,
        infinite:true,
        speed:500,
        slidesToShow:1,
        slidesToScroll:1,
        autoplay:false,
        autoplaySpeed:3000,
    };

    const promotions=[
    {
        id:1,
        title:'Vuelta al cole ',
        image:"/images/promo1.jpeg",
        link:"/category/libreria"
    },
    {
        id:2,
        title:'Vuelta al color ',
        image:"/images/promo2.jpeg",
        link:"/category/libreria"
    }
    ];
    return(
        <div className="bg-gray-50 py-4">
             <Slider {...settings}>
                {promotions.map((promo)=>(
                    <div key={promo.id} className="px-2">
                        <a href={promo.link}>
                            <div className="relative rounded-lg overflow-hidden shadow-lg">
                                <img 
                                src={promo.image}
                                alt={promo.title}
                                className="w-full h-64 object-contain object-contain"/>
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                                    <h3 className="text-2xl font-bold">{promo.title}</h3>
                                </div>
                            </div>
                        </a>
                    </div>
                ))}
             </Slider>
        </div>
    )
}
export default PromoCarousel;