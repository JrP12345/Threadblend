import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { onChildAdded, ref as dbRef } from "firebase/database";
import db from "../firebase";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "../Styles/Slider.css";

function Slider() {
  const [selectedImages, setSelectedImages] = useState([null, null, null]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const sliderRef = dbRef(db, "sliderImages");

        onChildAdded(sliderRef, (snapshot) => {
          const newImage = snapshot.val();
          setSelectedImages((prevImages) => {
            const updatedImages = [...prevImages];
            updatedImages[newImage.index - 1] = newImage.imageUrl;
            return updatedImages;
          });

          setLoading(false); // Set loading to false once images are loaded
        });
      } catch (error) {
        console.error("Error fetching images from the database:", error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="slider-container">
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
        >
          {[0, 1, 2].map((index) => (
            <SwiperSlide key={index}>
              {selectedImages[index] && (
                <img
                  src={selectedImages[index]}
                  className="slider-img"
                  alt={`Selected ${index + 1}`}
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

export default Slider;
