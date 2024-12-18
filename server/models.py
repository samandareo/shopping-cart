from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(100), nullable=False)
    product_price = db.Column(db.Float, nullable=False)
    tax = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    product_image = db.Column(db.String(200), nullable=True)

    def __repr__(self):
        return f"<Product {self.product_name}>"

class Cart(db.Model):
    __tablename__ = 'cart'
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"<Cart {self.product_id}>"