import { client, urlFor } from "lib/client";
import { GetStaticPaths, GetStaticProps } from "next";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import Product from "@/components/Product";
import { useState } from "react";
import { useStateContext, UseStateContextProps } from "@/context/StateContext";
import { CartItem } from "@/@types/CartItem";

interface ProductDetailsProps {
  product: CartItem;
  products: CartItem[];
}

const ProductDetails = ({ product, products }: ProductDetailsProps) => {
  const [index, setIndex] = useState<number>(0);
  const { name, image, price, details } = product;
  const { setShowCart, incQty, decQty, qty, onAdd } =
    useStateContext() as UseStateContextProps;

  const handleBuyNow = () => {
    onAdd(product, qty);

    setShowCart(true);
  };

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img
              src={urlFor(image && image[index]).toString()}
              alt={name}
              className="product-detail-image"
            />
          </div>
          <div className="small-images-container">
            {image?.map((item, i) => (
              <img
                key={i}
                src={urlFor(item).toString()}
                className={
                  i == index ? "small-image selected-image" : "small-image"
                }
                onMouseEnter={() => setIndex(i)}
                alt={`image ${i}`}
              />
            ))}
          </div>
        </div>
        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <div>
            <h4>Details:</h4>
            <p>{details}</p>
            <p className="price">{price}</p>
            <div className="quantity">
              <h3>Quantity:</h3>
              <p className="quantity-desc">
                <span className="minus" onClick={decQty}>
                  <AiOutlineMinus />
                </span>
                <span className="num">{qty}</span>
                <span className="plus" onClick={incQty}>
                  <AiOutlinePlus />
                </span>
              </p>
            </div>
          </div>
          <div className="buttons">
            <button
              type="button"
              className="add-to-cart"
              onClick={() => onAdd(product, qty)}
            >
              Add to cart
            </button>
            <button type="button" className="buy-now" onClick={handleBuyNow}>
              Buy now
            </button>
          </div>
        </div>
      </div>
      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item, i) => (
              <Product key={i} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetails;

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `*[_type == "product"] {
   slug {
    current
   } 
  }`;
  const products = await client.fetch(query);
  const paths = products.map((product: CartItem) => ({
    params: { slug: product.slug.current },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "product" && slug.current == '${params!.slug}'][0]`;
  const productQuery = '*[_type == "product"]';
  const product = await client.fetch(query);
  const products = await client.fetch(productQuery);

  return { props: { products, product } };
};