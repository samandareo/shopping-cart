import Image from "next/image";
import styles from "@/app/main.module.css"
import ProductsContainer from "@/components/ProductsContainer";
import CartCard from "@/components/CartCard";

export default function Home() {
  return (
    <div className={styles["main-page"]}>
      <ProductsContainer />
    </div>
  );
}
