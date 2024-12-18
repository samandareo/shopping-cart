"use client";
import Image from "next/image";
import { motion } from 'framer-motion';
import { useEffect, useState } from "react";
import styles from "@/components/ProductsContainer.module.css";

import ProductCard from "./ProductCard";

// Images
import con_milk from "@/app/images/con-milk.png";
import add_icon from "@/app/images/add.svg";
import remove_icon from "@/app/images/remove.svg";
import CartCard from "./CartCard";



export default function ProductsContainer() {
    // Variables
    const [quantity, setQuantity] = useState(1);
    const [cartOpen, setCartOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleCartOpen = () => setCartOpen(!cartOpen);

    useEffect(() => {
        async function fetchProducts() {
            const response = await fetch('http://127.0.0.1:5000/products');
            const data = await response.json();
            setProducts(data);
            setLoading(false);
        }

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <motion.div
                    className="relative w-20 h-20"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            scale: [1, 1.5, 1],
                            rotate: [0, 360],
                            opacity: [0.7, 1, 0.7],
                            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                        },
                    }}
                >
                    <motion.div
                        className="absolute inset-0 w-20 h-20 rounded-full border-4 border-t-blue-500 border-gray-300"
                    ></motion.div>
                    <motion.div
                        className="absolute inset-0 w-10 h-10 bg-blue-500 rounded-full"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [1, 0.7, 1],
                            transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                        }}
                    ></motion.div>
                </motion.div>
            </div>
        );
    }
    

    return (
        <div className="flex justify-between mx-auto gap-4">
            <div className={styles["products-container"]}>
                <div className="flex justify-between items-center mt-3">
                    <h1 className="text-3xl font-bold text-[--title-color] mx-auto">GROCERY STORE</h1>
                    <button className={`${styles["cart-add-btn"]}`}>
                        <Image
                            src="/shopping-cart.svg"
                            alt="cart"
                            width={20}
                            height={20}
                            onClick={handleCartOpen}
                        />
                    </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-7">
                    {products.map((product:any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
            {
                (cartOpen) &&
                <CartCard quantity={quantity} />
            }
        </div>
    );
}