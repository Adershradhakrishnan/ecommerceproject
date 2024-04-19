import React from "react";
import { Carousel } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import carousel1 from './images/carousel1.webp';
import carousel2 from './images/carousel2.webp';
import carousel3 from './images/carousel3.webp';

const MyCarousel = () => {
    return (
        <Carousel>
            <Carousel.Item>
                <img
                    className="d-block w-100 "
                    src={carousel1}
                    alt="First slide"
                />
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100 "
                    src={carousel2}
                    alt="Second slide"
                />
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100 "
                    src={carousel3}
                    alt="Third slide"
                />

            </Carousel.Item>
        </Carousel>
    );
};

export default MyCarousel;