from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, send_file
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date
from io import BytesIO
import os
import barcode
from barcode.writer import ImageWriter

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SESSION_SECRET', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///store.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ─── Models ───────────────────────────────────────────────────────────────────

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(30))
    email = db.Column(db.String(120))
    address = db.Column(db.Text)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    debts = db.relationship('Debt', backref='customer', lazy=True, cascade='all, delete-orphan')
    sales = db.relationship('Sale', backref='customer', lazy=True)

    @property
    def total_debt(self):
        return sum(d.remaining for d in self.debts if d.remaining > 0)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    barcode_value = db.Column(db.String(60), unique=True)
    price = db.Column(db.Float, default=0.0)
    cost = db.Column(db.Float, default=0.0)
    stock = db.Column(db.Integer, default=0)
    min_stock = db.Column(db.Integer, default=5)
    category = db.Column(db.String(80))
    unit = db.Column(db.String(30), default='un')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    @property
    def low_stock(self):
        return self.stock <= self.min_stock

class Debt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    description = db.Column(db.String(255))
    amount = db.Column(db.Float, nullable=False)
    paid = db.Column(db.Float, default=0.0)
    due_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    payments = db.relationship('Payment', backref='debt', lazy=True, cascade='all, delete-orphan')

    @property
    def remaining(self):
        return max(0.0, self.amount - self.paid)

    @property
    def status(self):
        if self.remaining <= 0:
            return 'paid'
        if self.due_date and self.due_date < date.today():
            return 'overdue'
        return 'pending'

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    debt_id = db.Column(db.Integer, db.ForeignKey('debt.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    note = db.Column(db.String(255))
    paid_at = db.Column(db.DateTime, default=datetime.utcnow)

class Sale(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=True)
    total = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(30), default='cash')
    note = db.Column(db.String(255))
    charged_to_debt = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    items = db.relationship('SaleItem', backref='sale', lazy=True, cascade='all, delete-orphan')

    @property
    def item_count(self):
        return sum(i.quantity for i in self.items)

class SaleItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sale_id = db.Column(db.Integer, db.ForeignKey('sale.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=True)
    product_name = db.Column(db.String(120), nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    subtotal = db.Column(db.Float, nullable=False)
    product = db.relationship('Product')

# ─── Init DB ──────────────────────────────────────────────────────────────────

with app.app_context():
    db.create_all()

# ─── Dashboard ────────────────────────────────────────────────────────────────

@app.route('/')
def dashboard():
    total_customers = Customer.query.count()
    total_products = Product.query.count()
    low_stock_products = Product.query.filter(Product.stock <= Product.min_stock).all()
    debtors = Customer.query.all()
    total_debt = sum(c.total_debt for c in debtors)
    recent_payments = Payment.query.order_by(Payment.paid_at.desc()).limit(5).all()
    overdue_debts = Debt.query.all()
    overdue_count = sum(1 for d in overdue_debts if d.status == 'overdue')

    today_start = datetime.combine(date.today(), datetime.min.time())
    today_sales = Sale.query.filter(Sale.created_at >= today_start).all()
    today_revenue = sum(s.total for s in today_sales if not s.charged_to_debt)
    today_count = len(today_sales)

    recent_sales = Sale.query.order_by(Sale.created_at.desc()).limit(5).all()

    return render_template('dashboard.html',
        total_customers=total_customers,
        total_products=total_products,
        low_stock_products=low_stock_products,
        total_debt=total_debt,
        recent_payments=recent_payments,
        overdue_count=overdue_count,
        today_revenue=today_revenue,
        today_count=today_count,
        recent_sales=recent_sales,
    )

# ─── Customers ────────────────────────────────────────────────────────────────

@app.route('/customers')
def customers():
    q = request.args.get('q', '')
    if q:
        custs = Customer.query.filter(
            Customer.name.ilike(f'%{q}%') | Customer.phone.ilike(f'%{q}%')
        ).all()
    else:
        custs = Customer.query.order_by(Customer.name).all()
    return render_template('customers.html', customers=custs, q=q)

@app.route('/customers/new', methods=['GET', 'POST'])
def new_customer():
    if request.method == 'POST':
        c = Customer(
            name=request.form['name'],
            phone=request.form.get('phone', ''),
            email=request.form.get('email', ''),
            address=request.form.get('address', ''),
            notes=request.form.get('notes', '')
        )
        db.session.add(c)
        db.session.commit()
        flash('Cliente cadastrado com sucesso!', 'success')
        return redirect(url_for('customer_detail', id=c.id))
    return render_template('customer_form.html', customer=None)

@app.route('/customers/<int:id>')
def customer_detail(id):
    c = Customer.query.get_or_404(id)
    debts = Debt.query.filter_by(customer_id=id).order_by(Debt.created_at.desc()).all()
    sales = Sale.query.filter_by(customer_id=id).order_by(Sale.created_at.desc()).limit(10).all()
    return render_template('customer_detail.html', customer=c, debts=debts, sales=sales)

@app.route('/customers/<int:id>/edit', methods=['GET', 'POST'])
def edit_customer(id):
    c = Customer.query.get_or_404(id)
    if request.method == 'POST':
        c.name = request.form['name']
        c.phone = request.form.get('phone', '')
        c.email = request.form.get('email', '')
        c.address = request.form.get('address', '')
        c.notes = request.form.get('notes', '')
        db.session.commit()
        flash('Cliente atualizado!', 'success')
        return redirect(url_for('customer_detail', id=c.id))
    return render_template('customer_form.html', customer=c)

@app.route('/customers/<int:id>/delete', methods=['POST'])
def delete_customer(id):
    c = Customer.query.get_or_404(id)
    db.session.delete(c)
    db.session.commit()
    flash('Cliente removido.', 'info')
    return redirect(url_for('customers'))

@app.route('/customers/<int:id>/whatsapp')
def whatsapp_reminder(id):
    c = Customer.query.get_or_404(id)
    total = c.total_debt
    msg = f"Olá {c.name}! Passando para lembrar que você tem um saldo devedor de R$ {total:.2f} em nossa loja. Qualquer dúvida estamos à disposição!"
    phone = c.phone.replace(' ', '').replace('-', '').replace('(', '').replace(')', '').replace('+', '')
    if phone.startswith('0'):
        phone = '55' + phone[1:]
    elif not phone.startswith('55'):
        phone = '55' + phone
    url = f"https://wa.me/{phone}?text={msg}"
    return redirect(url)

# ─── Debts ────────────────────────────────────────────────────────────────────

@app.route('/debts')
def debts():
    status_filter = request.args.get('status', 'all')
    all_debts = Debt.query.order_by(Debt.created_at.desc()).all()
    if status_filter == 'pending':
        filtered = [d for d in all_debts if d.status == 'pending']
    elif status_filter == 'overdue':
        filtered = [d for d in all_debts if d.status == 'overdue']
    elif status_filter == 'paid':
        filtered = [d for d in all_debts if d.status == 'paid']
    else:
        filtered = all_debts
    return render_template('debts.html', debts=filtered, status_filter=status_filter)

@app.route('/debts/new', methods=['GET', 'POST'])
def new_debt():
    customers = Customer.query.order_by(Customer.name).all()
    if request.method == 'POST':
        due_date = None
        if request.form.get('due_date'):
            due_date = datetime.strptime(request.form['due_date'], '%Y-%m-%d').date()
        d = Debt(
            customer_id=int(request.form['customer_id']),
            description=request.form.get('description', ''),
            amount=float(request.form['amount']),
            due_date=due_date
        )
        db.session.add(d)
        db.session.commit()
        flash('Dívida registrada!', 'success')
        return redirect(url_for('customer_detail', id=d.customer_id))
    preselect = request.args.get('customer_id')
    return render_template('debt_form.html', customers=customers, preselect=preselect)

@app.route('/debts/<int:id>/pay', methods=['POST'])
def pay_debt(id):
    d = Debt.query.get_or_404(id)
    amount = float(request.form['amount'])
    note = request.form.get('note', '')
    p = Payment(debt_id=d.id, amount=amount, note=note)
    d.paid = (d.paid or 0) + amount
    db.session.add(p)
    db.session.commit()
    flash(f'Pagamento de R$ {amount:.2f} registrado!', 'success')
    return redirect(url_for('customer_detail', id=d.customer_id))

@app.route('/debts/<int:id>/delete', methods=['POST'])
def delete_debt(id):
    d = Debt.query.get_or_404(id)
    cid = d.customer_id
    db.session.delete(d)
    db.session.commit()
    flash('Dívida removida.', 'info')
    return redirect(url_for('customer_detail', id=cid))

# ─── Inventory ────────────────────────────────────────────────────────────────

@app.route('/inventory')
def inventory():
    q = request.args.get('q', '')
    cat = request.args.get('cat', '')
    low = request.args.get('low', '')
    query = Product.query
    if q:
        query = query.filter(Product.name.ilike(f'%{q}%') | Product.barcode_value.ilike(f'%{q}%'))
    if cat:
        query = query.filter_by(category=cat)
    products = query.order_by(Product.name).all()
    if low:
        products = [p for p in products if p.low_stock]
    categories = db.session.query(Product.category).distinct().all()
    categories = [c[0] for c in categories if c[0]]
    return render_template('inventory.html', products=products, q=q, cat=cat, low=low, categories=categories)

@app.route('/inventory/new', methods=['GET', 'POST'])
def new_product():
    if request.method == 'POST':
        p = Product(
            name=request.form['name'],
            barcode_value=request.form.get('barcode_value') or None,
            price=float(request.form.get('price') or 0),
            cost=float(request.form.get('cost') or 0),
            stock=int(request.form.get('stock') or 0),
            min_stock=int(request.form.get('min_stock') or 5),
            category=request.form.get('category', ''),
            unit=request.form.get('unit', 'un')
        )
        db.session.add(p)
        db.session.commit()
        flash('Produto cadastrado!', 'success')
        return redirect(url_for('inventory'))
    return render_template('product_form.html', product=None)

@app.route('/inventory/<int:id>/edit', methods=['GET', 'POST'])
def edit_product(id):
    p = Product.query.get_or_404(id)
    if request.method == 'POST':
        p.name = request.form['name']
        p.barcode_value = request.form.get('barcode_value') or None
        p.price = float(request.form.get('price') or 0)
        p.cost = float(request.form.get('cost') or 0)
        p.stock = int(request.form.get('stock') or 0)
        p.min_stock = int(request.form.get('min_stock') or 5)
        p.category = request.form.get('category', '')
        p.unit = request.form.get('unit', 'un')
        db.session.commit()
        flash('Produto atualizado!', 'success')
        return redirect(url_for('inventory'))
    return render_template('product_form.html', product=p)

@app.route('/inventory/<int:id>/delete', methods=['POST'])
def delete_product(id):
    p = Product.query.get_or_404(id)
    db.session.delete(p)
    db.session.commit()
    flash('Produto removido.', 'info')
    return redirect(url_for('inventory'))

@app.route('/inventory/<int:id>/adjust', methods=['POST'])
def adjust_stock(id):
    p = Product.query.get_or_404(id)
    delta = int(request.form.get('delta', 0))
    p.stock = max(0, p.stock + delta)
    db.session.commit()
    return jsonify({'stock': p.stock, 'low_stock': p.low_stock})

@app.route('/inventory/barcode-lookup')
def barcode_lookup():
    code = request.args.get('code', '')
    p = Product.query.filter_by(barcode_value=code).first()
    if p:
        return jsonify({'found': True, 'id': p.id, 'name': p.name, 'price': p.price, 'stock': p.stock, 'unit': p.unit})
    return jsonify({'found': False})

@app.route('/inventory/search')
def product_search():
    q = request.args.get('q', '')
    products = Product.query.filter(
        Product.name.ilike(f'%{q}%') | Product.barcode_value.ilike(f'%{q}%')
    ).limit(10).all()
    return jsonify([{
        'id': p.id, 'name': p.name, 'price': p.price,
        'stock': p.stock, 'unit': p.unit, 'barcode_value': p.barcode_value or ''
    } for p in products])

@app.route('/inventory/<int:id>/barcode-image')
def barcode_image(id):
    p = Product.query.get_or_404(id)
    if not p.barcode_value:
        return 'No barcode', 404
    try:
        buf = BytesIO()
        EAN = barcode.get_barcode_class('code128')
        ean = EAN(p.barcode_value, writer=ImageWriter())
        ean.write(buf)
        buf.seek(0)
        return send_file(buf, mimetype='image/png')
    except Exception:
        return 'Error generating barcode', 500

# ─── Sales ────────────────────────────────────────────────────────────────────

PAYMENT_LABELS = {
    'cash': 'Dinheiro',
    'card_credit': 'Cartão de Crédito',
    'card_debit': 'Cartão de Débito',
    'pix': 'PIX',
    'debt': 'Fiado (dívida)',
}

@app.route('/sales')
def sales():
    page = request.args.get('page', 1, type=int)
    date_filter = request.args.get('date', '')
    method_filter = request.args.get('method', '')
    query = Sale.query
    if date_filter:
        try:
            d = datetime.strptime(date_filter, '%Y-%m-%d').date()
            query = query.filter(
                Sale.created_at >= datetime.combine(d, datetime.min.time()),
                Sale.created_at < datetime.combine(d, datetime.max.time())
            )
        except ValueError:
            pass
    if method_filter:
        query = query.filter_by(payment_method=method_filter)
    sales_page = query.order_by(Sale.created_at.desc()).paginate(page=page, per_page=20, error_out=False)
    total_shown = sum(s.total for s in sales_page.items)
    return render_template('sales.html',
        sales=sales_page,
        total_shown=total_shown,
        date_filter=date_filter,
        method_filter=method_filter,
        payment_labels=PAYMENT_LABELS
    )

@app.route('/sales/register', methods=['GET'])
def sale_register():
    customers = Customer.query.order_by(Customer.name).all()
    return render_template('sale_register.html', customers=customers, payment_labels=PAYMENT_LABELS)

@app.route('/sales/register', methods=['POST'])
def sale_register_post():
    data = request.get_json()
    if not data or not data.get('items'):
        return jsonify({'error': 'Carrinho vazio'}), 400

    items_data = data['items']
    payment_method = data.get('payment_method', 'cash')
    customer_id = data.get('customer_id') or None
    note = data.get('note', '')

    total = sum(float(i['subtotal']) for i in items_data)
    charged_to_debt = (payment_method == 'debt')

    if charged_to_debt and not customer_id:
        return jsonify({'error': 'Selecione um cliente para registrar como fiado'}), 400

    sale = Sale(
        customer_id=int(customer_id) if customer_id else None,
        total=total,
        payment_method=payment_method,
        note=note,
        charged_to_debt=charged_to_debt
    )
    db.session.add(sale)
    db.session.flush()

    for item_data in items_data:
        product_id = item_data.get('product_id')
        quantity = float(item_data['quantity'])
        unit_price = float(item_data['unit_price'])
        subtotal = float(item_data['subtotal'])
        product_name = item_data['name']

        item = SaleItem(
            sale_id=sale.id,
            product_id=int(product_id) if product_id else None,
            product_name=product_name,
            unit_price=unit_price,
            quantity=quantity,
            subtotal=subtotal
        )
        db.session.add(item)

        if product_id:
            p = Product.query.get(int(product_id))
            if p:
                p.stock = max(0, p.stock - int(quantity))

    if charged_to_debt and customer_id:
        items_summary = ', '.join(f"{i['quantity']}x {i['name']}" for i in items_data)
        debt = Debt(
            customer_id=int(customer_id),
            description=f"Venda #{sale.id}: {items_summary}"[:255],
            amount=total,
        )
        db.session.add(debt)

    db.session.commit()
    return jsonify({'success': True, 'sale_id': sale.id})

@app.route('/sales/<int:id>')
def sale_detail(id):
    s = Sale.query.get_or_404(id)
    return render_template('sale_detail.html', sale=s, payment_labels=PAYMENT_LABELS)

@app.route('/sales/<int:id>/delete', methods=['POST'])
def delete_sale(id):
    s = Sale.query.get_or_404(id)
    for item in s.items:
        if item.product_id:
            p = Product.query.get(item.product_id)
            if p:
                p.stock += int(item.quantity)
    db.session.delete(s)
    db.session.commit()
    flash('Venda cancelada e estoque restaurado.', 'info')
    return redirect(url_for('sales'))

# ─── API: stats ────────────────────────────────────────────────────────────────

@app.route('/api/stats')
def api_stats():
    products = Product.query.all()
    customers = Customer.query.all()
    total_debt = sum(c.total_debt for c in customers)
    low_stock = [{'id': p.id, 'name': p.name, 'stock': p.stock, 'min_stock': p.min_stock} for p in products if p.low_stock]
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_revenue = db.session.query(db.func.sum(Sale.total)).filter(
        Sale.created_at >= today_start, Sale.charged_to_debt == False
    ).scalar() or 0
    return jsonify({
        'total_customers': len(customers),
        'total_products': len(products),
        'total_debt': total_debt,
        'low_stock_count': len(low_stock),
        'low_stock': low_stock,
        'today_revenue': today_revenue,
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
