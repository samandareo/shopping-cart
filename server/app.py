from itertools import product
from flask import Flask, jsonify, request, render_template, redirect, url_for
from flask_cors import CORS
from werkzeug.utils import secure_filename

from models import db, Product, Cart
from database import insert_product, fetch_all_products, fetch_product_by_id, remove_product_from_cart, add_product_to_cart, get_cart, delete_product_from_cart

import os

app = Flask(__name__)

CORS(app)

app.config['UPLOAD_FOLDER'] = 'static/images'
app.config['ALLOWED_EXTENSIONS'] = {'jpg', 'jpeg', 'png'}

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///products.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


@app.route('/cart/add-product', methods=['POST'])
def add_product_to_cart_route():
    product_id = request.json['product_id']
    quantity = request.json['updatedQuantity']
    add_product_to_cart(product_id, quantity)
    return jsonify({'message': 'Product added to cart successfully'}), 200

@app.route('/cart/remove-product', methods=['PUT'])
def remove_product_from_cart_route():
    product_id = request.json['product_id']
    quantity = request.json['updatedQuantity']
    remove_product_from_cart(product_id, quantity)
    return jsonify({'message': 'Product removed from cart successfully'}), 200

@app.route('/cart/cart-items', methods=['GET'])
def get_cart_items():
    cart_with_products = get_cart()
    return jsonify([
        {
            "product_id": item.product_id,
            "product_name": item.product_name,
            "product_price": item.product_price,
            "tax": item.tax,
            "stock_quantity": item.stock_quantity,
            "product_image": url_for('static', filename=item.product_image, _external=True),
            "cart_quantity": item.cart_quantity
        }
        for item in cart_with_products
    ])

@app.route('/cart/delete-item', methods=['DELETE'])
def delete_item_from_cart():
    if request.method == 'DELETE':
        product_id = request.json['product_id']
        delete_product_from_cart(product_id)
        return jsonify({'message': 'Product removed from cart successfully'}), 200

@app.route('/admin/add_product', methods=['GET', 'POST'])
def add_product():
    if request.method == 'POST':
        product_name = request.form['product_name']
        product_price = float(request.form['product_price'])
        tax = float(request.form['tax'])
        quantity = int(request.form['quantity'])
        product_image = None

        file = request.files['product_image']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(f'static/images/{filename}')
            product_image = f'{filename}'

        new_product = Product(
            product_name=product_name,
            product_price=product_price,
            tax=tax,
            quantity=quantity,
            product_image=product_image
        )
        db.session.add(new_product)
        db.session.commit()
        return redirect(url_for('product_list'))

    return render_template('add_product.html')

@app.route('/admin/update_product/<int:id>', methods=['GET', 'POST'])
def update_product(id):
    product = Product.query.get(id)

    if request.method == 'POST':
        product_name = request.form.get('product_name')
        product_price = float(request.form.get('product_price'))
        tax = float(request.form.get('tax'))
        quantity = int(request.form.get('quantity'))
        
        product_image = request.files.get('product_image')
        if product_image and product_image.filename != '':
            image_filename = secure_filename(product_image.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
            product_image.save(image_path)
            product.product_image = f'images/{image_filename}'

        product.product_name = product_name
        product.product_price = product_price
        product.tax = tax
        product.quantity = quantity

        db.session.commit()
        return redirect(url_for('product_list'))

    return render_template('update_product.html', product=product)

@app.route('/admin/delete_product/<int:id>', methods=['POST'])
def delete_product(id):
    from database import delete_product
    try:
        delete_product(id)
        return redirect(url_for('product_list'))
    except Exception as e:
        print(f"Error deleting product: {e}")
        return redirect(url_for('product_list'))

@app.route('/admin/products')
def product_list():
    products = Product.query.all()
    return render_template('product_list.html', products=products)

@app.route('/products', methods=['GET'])
def get_products():
    products = fetch_all_products()
    return jsonify([
        {
            "product_id": item.product_id,
            "product_name": item.product_name,
            "product_price": item.product_price,
            "tax": item.tax,
            "stock_quantity": item.stock_quantity,
            "product_image": url_for('static', filename=item.product_image, _external=True),
            "cart_quantity": item.cart_quantity
        }
        for item in products
    ])


if __name__ == '__main__':
    app.run(debug=True)