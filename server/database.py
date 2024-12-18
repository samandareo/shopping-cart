from itertools import product
from sqlalchemy.exc import IntegrityError
from models import db, Product, Cart
import os

def insert_product(product_name, product_price, tax, quantity, product_image=None):
    product = Product(
        product_name=product_name,
        product_price=product_price,
        tax=tax,
        quantity=quantity,
        product_image=product_image
    )
    db.session.add(product)
    db.session.commit()
    print(f"Product '{product_name}' added successfully!")

def update_product(id, product_name, product_price, tax, quantity, product_image_path):
    try:
        product = Product.query.get(id)
        if not product:
            raise ValueError("Product not found")

        product.product_name = product_name
        product.product_price = product_price
        product.tax = tax
        product.quantity = quantity

        if product_image_path:
            product.product_image = product_image_path

        db.session.commit()
        return True
    except IntegrityError:
        db.session.rollback()
        raise

def delete_product(id):
    try:
        product = Product.query.get(id)
        if not product:
            raise ValueError("Product not found")
        
        if product.product_image:
            image_path = os.path.join(os.getcwd(), product.product_image.strip('/'))
            if os.path.isfile(image_path):
                os.remove(image_path)
        
        db.session.delete(product)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting product: {e}")
        raise

def fetch_all_products():
    products = (
        db.session.query(
            Product.id.label("product_id"),
            Product.product_name,
            Product.product_price,
            Product.tax,
            Product.quantity.label("stock_quantity"),
            Product.product_image,
            Cart.quantity.label("cart_quantity")
        )
        .outerjoin(Cart , Cart.product_id == Product.id)
        .all()
    )
    return products

def fetch_product_by_id(product_id):
    return Product.query.get(product_id)

def add_product_to_cart(product_id, quantity):
    cart_item = Cart.query.filter_by(product_id=product_id).first()
    if cart_item:
        cart_item.quantity += quantity
        db.session.commit()
        return cart_item
    else:
        cart_item = Cart(product_id=product_id, quantity=quantity)
        db.session.add(cart_item)
        db.session.commit()
        return cart_item

def remove_product_from_cart(product_id, quantity):
    cart_item = Cart.query.filter_by(product_id=product_id).first()
    if cart_item:
        if cart_item.quantity > quantity:
            cart_item.quantity -= quantity
            db.session.commit()
        else:
            db.session.delete(cart_item)
            db.session.commit()
    return 
    
def get_cart():
    cart_with_products = (
        db.session.query(
            Cart.product_id,
            Product.product_name,
            Product.product_price,
            Product.tax,
            Product.quantity.label("stock_quantity"),
            Product.product_image,
            Cart.quantity.label("cart_quantity")
        )
        .join(Product, Cart.product_id == Product.id)
        .all()
    )
    return cart_with_products

def delete_product_from_cart(product_id):
    cart_item = Cart.query.filter_by(product_id=product_id).first()
    if cart_item:
        db.session.delete(cart_item)
        db.session.commit()
    return