import { ProductItem } from "@/@types/Product";
import Link from "next/link";

import { urlFor } from "../../lib/client";

interface ProductProps {
  product: ProductItem;
}
const Product = ({ product: { image, name, slug, price } }: ProductProps) => {
  return (
    <div className="keen-slider__slide">
      <Link href={`/product/${slug.current}`}>
        <div className="product-card slide-content">
          <img
            src={urlFor(image && image[0]).toString()}
            alt=""
            width={250}
            height={250}
            className="product-image"
          />
          <div>
            <p className="product-name">{name}</p>
            <p className="product-price">{price}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};
export default Product;
