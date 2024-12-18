"use client";
import Image from "next/image";
import styles from "./CartCard.module.css";

import add_icon from "@/app/images/add.svg";
import remove_icon from "@/app/images/remove.svg";
import close_icon from "@/app/images/close.svg";

import { useState, useEffect } from "react";

export default function CartItem({product}: any) {

    const [quantity, setQuantity] = useState(product.cart_quantity);
    const [stockQuantity, setStockQuantity] = useState(product.stock_quantity-product.cart_quantity);
    const [isDeleted, setIsDeleted] = useState(false);
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

    const removeProduct = async (product_id: number) => {
        setIsDeleted(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/cart/delete-item', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ product_id })
            })

            if(!response.ok) {
                throw new Error('Failed to remove product to cart');
            }
        } catch (error) {
            console.error('Error removing product to cart:', error);
        }
    }



    return (
        <div className={`${styles["cart-item"]} ${isDeleted ? "hidden" : ""}`}>
            <div key={product.product_id} className={`flex justify-between items-center mt-4 bg-slate-100 p-2 rounded-lg ${styles["cart-item"]}`}>
                <div className="w-1/4">
                    <Image
                        className="border rounded-lg"
                        src={product.product_image}
                        alt={product.product_name}
                        layout="responsive"
                        width={200}
                        height={200}
                        unoptimized
                    />
                </div>
                <div>
                    <h3 className="font-semibold">{product.product_name}</h3>
                    <h4 className="text-slate-700 font-normal">Price: {product.product_price}$</h4>
                    <h4 className="text-slate-700 font-normal">InStock: {stockQuantity}</h4>
                </div>
                
                <div className="flex flex-col justify-between items-end gap-4">
                    <Image
                        className="cursor-pointer"
                        src={close_icon}
                        alt="Remove"
                        width={25}
                        height={25}
                        onClick={() => removeProduct(product.product_id)}
                    />
                    <div className={`flex justify-between gap-2`}>
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
        </div>
    )
}