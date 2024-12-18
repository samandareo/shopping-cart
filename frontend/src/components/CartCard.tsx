"use client";

import Image from "next/image";
import styles from "./CartCard.module.css";
import CartItem from "./CartItem";

import close_icon from "@/app/images/close.svg";

import { useState, useEffect } from "react";


export default function CartCard(props: any) {

    const [cartProducts, setCartProducts] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState("");

    useEffect(() => {
        async function fetchProducts() {
            const response = await fetch('http://127.0.0.1:5000/cart/cart-items');
            const data = await response.json();
            setCartProducts(data);
        }
        fetchProducts();
    }, []);

    useEffect(() => {
        const subTotal = cartProducts.reduce((acc, curr) => acc + curr.product_price * curr.cart_quantity, 0);
        const products_tax: number = cartProducts.reduce((acc, curr) => acc + curr.tax, 0);
        const tax: string = (subTotal * products_tax).toFixed(2);
        const taxNum : number = parseFloat(tax);
        const total: string = (subTotal + taxNum).toFixed(2);

        setSubTotal(subTotal);
        setTax(taxNum);
        setTotal(total);
    }, [cartProducts]);

    return (
        <div className={`${styles["cart-card"]}`}>
            <div className={styles["card-body"]}>
                <div className={styles["card-header"]}>
                    <h5 className="text-2xl font-bold text-[--title-color]">Cart</h5>
                    <Image
                        src={close_icon}
                        alt="Close"
                        width={25}
                        height={25}
                    />
                </div>

                <div className={`border-2 rounded-lg p-4 text-center mt-4 ${cartProducts.length > 0 ? "hidden" : ""}`}>
                    <h2 className="text-lg font-bold text-slate-500 mb-1">There are no items in your cart</h2>
                    <p className="text-slate-500">Please select items and come back to cart</p>
                </div>
                {cartProducts.map((product:any) => (
                        <CartItem key={product.product_id} product={product} />
                    ))}
            </div>
            <div className={`${styles["card-footer"]}`}>
                    <div className="flex justify-between">
                        <h3 className="font-bold text-lg">Subtotal: </h3>
                        <span className="font-normal">{subTotal}$</span>
                    </div>
                    <div className="flex justify-between border-b border-white mb-3">
                        <h3 className="font-bold text-lg">Tax: </h3>
                        <span className="font-normal">{tax}$</span>
                    </div>
                    <div className="flex justify-between">
                        <h2 className="font-bold text-xl">Total: </h2>
                        <span className="font-normal">{total}$</span>
                    </div>
                </div>
        </div>
    )
}