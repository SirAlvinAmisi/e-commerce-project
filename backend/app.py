from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import requests
import os
import stripe
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Stripe configuration
stripe.api_key = 'sk_test_51•••••Bt6'

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecommerce.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(500), nullable=False)
    stock = db.Column(db.Integer, default=10)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_email = db.Column(db.String(120), nullable=False)
    customer_name = db.Column(db.String(120), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    stripe_session_id = db.Column(db.String(200), nullable=True)

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)

# Routes
@app.route('/api/products', methods=['GET', 'POST'])
def handle_products():
    if request.method == 'GET':
        products = Product.query.all()
        return jsonify([{
            'id': p.id,
            'title': p.title,
            'price': p.price,
            'description': p.description,
            'category': p.category,
            'image': p.image,
            'stock': p.stock
        } for p in products])
    
    elif request.method == 'POST':
        data = request.json
        product = Product(
            title=data['title'],
            price=float(data['price']),
            description=data['description'],
            category=data['category'],
            image=data['image'],
            stock=int(data['stock'])
        )
        db.session.add(product)
        db.session.commit()
        return jsonify({'message': 'Product created successfully'})

@app.route('/api/products/<int:product_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_product(product_id):
    product = Product.query.get_or_404(product_id)
    
    if request.method == 'GET':
        return jsonify({
            'id': product.id,
            'title': product.title,
            'price': product.price,
            'description': product.description,
            'category': product.category,
            'image': product.image,
            'stock': product.stock
        })
    
    elif request.method == 'PUT':
        data = request.json
        product.title = data['title']
        product.price = float(data['price'])
        product.description = data['description']
        product.category = data['category']
        product.image = data['image']
        product.stock = int(data['stock'])
        db.session.commit()
        return jsonify({'message': 'Product updated successfully'})
    
    elif request.method == 'DELETE':
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product deleted successfully'})

@app.route('/api/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        data = request.json
        
        # Create line items for Stripe
        line_items = [{
            'price_data': {
                'currency': 'usd',
                'product_data': {
                    'name': item['title'],
                    'images': [item['image']] if item.get('image') else [],
                },
                'unit_amount': int(item['price'] * 100),  # Stripe expects amounts in cents
            },
            'quantity': item['quantity'],
        } for item in data['items']]

        # Create Stripe checkout session
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url='http://localhost:5173/checkout/success',
            cancel_url='http://localhost:5173/cart',
        )

        # Create order in database
        order = Order(
            customer_email=data['email'],
            customer_name=data['name'],
            total_amount=data['total_amount'],
            stripe_session_id=session.id
        )
        db.session.add(order)
        
        for item in data['items']:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item['id'],
                quantity=item['quantity'],
                price=item['price']
            )
            db.session.add(order_item)
        
        db.session.commit()

        return jsonify({
            'id': session.id,
            'url': session.url
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders', methods=['GET'])
def get_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify([{
        'id': o.id,
        'customer_email': o.customer_email,
        'customer_name': o.customer_name,
        'total_amount': o.total_amount,
        'status': o.status,
        'created_at': o.created_at.isoformat()
    } for o in orders])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)