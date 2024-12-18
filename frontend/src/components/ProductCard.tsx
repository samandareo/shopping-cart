"use client";

import { useState } from "react";
import styles from "@/components/ProductsContainer.module.css";
import Image from "next/image";
import add_icon from "@/app/images/add.svg";
import remove_icon from "@/app/images/remove.svg";

export default function ProductCard({ product }: any) {
    const [quantity, setQuantity] = useState(product.cart_quantity);
    const [stockQuantity, setStockQuantity] = useState(product.stock_quantity - product.cart_quantity);

    // Functions
    const increaseQuantity = async (product_id: number) => {
        setQuantity(stockQuantity > 0 ? quantity + 1 : quantity);
        setStockQuantity(stockQuantity > 0 ? stockQuantity - 1 : stockQuantity);

        if (stockQuantity === 0) {
            return;
        }
        try {
            const response = await fetch('http://127.0.0.1:5000/cart/add-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ product_id, updatedQuantity: 1 })
            })

            if(!response.ok) {
                throw new Error('Failed to add product to cart');
            }

            const data = response.json();
            console.log('Cart updated:', data);
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    const decreaseQuantity = async (product_id: number) => {
        setQuantity(quantity > 0 ? quantity - 1 : 0);
        setStockQuantity(quantity > 0 ? stockQuantity + 1 : stockQuantity);

        if (quantity === 0) {
            return;
        }
        try {
            const response = await fetch('http://127.0.0.1:5000/cart/remove-product', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ product_id, updatedQuantity: 1 })
            })

            if(!response.ok) {
                throw new Error('Failed to remove product to cart');
            }

            const data = response.json();
            console.log('Cart updated:', data);
        } catch (error) {
            console.error('Error removing product to cart:', error);
        }
    };

    return (
        <div key={product.id} className={`bg-white p-4 rounded-lg ${styles["product-card"]}`}>
            <Image
                className="border rounded-lg"
                src={product.product_image}
                alt={product.product_name}
                layout="responsive"
                width={200}
                height={200}
                unoptimized
            />
            <div className="flex justify-start flex-col items-start mt-1">
                <h2 className="text-lg font-semibold">{product.product_name}</h2>
                <span className="flex gap-2 items-center">
                    <span>Price: </span>
                    <p className="text-[--title-color] text-sm">${product.product_price}</p>
                </span>
            </div>
            <div className="flex justify-end mt-4">
                <button className={`${styles["card-btn-style"]} ${quantity > 0 ? "hidden" : ""}`}
                    onClick={() => increaseQuantity(product.product_id)}>
                    Add
                </button>
                <div className={`flex justify-between gap-2 ${quantity < 1 ? "hidden" : ""}`}>
                    <button className={styles["card-control-btn-style"]} 
                        onClick={() => decreaseQuantity(product.product_id)}>
                        <Image
                            src={remove_icon}
                            alt="Remove"
                            width={20}
                            height={20}
                        />
                    </button>
                    <span className="font-semibold text-md">
                        {quantity}
                    </span>
                    <button className={styles["card-control-btn-style"]}
                        onClick={() => increaseQuantity(product.product_id)}>
                        <Image
                            src={add_icon}
                            alt="Add"
                            width={20}
                            height={20}
                        />
                    </button>
                </div>
            </div>
    </div>
    )
}