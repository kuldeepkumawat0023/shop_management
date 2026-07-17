require('dotenv').config();
const mongoose = require('mongoose');

// Import all models
const User = require('./src/models/User');
const Shop = require('./src/models/Shop');
const Settings = require('./src/models/Settings');
const Category = require('./src/models/Category');
const Brand = require('./src/models/Brand');
const Customer = require('./src/models/Customer');
const Supplier = require('./src/models/Supplier');
const Product = require('./src/models/Product');
const Purchase = require('./src/models/Purchase');
const PurchaseItem = require('./src/models/PurchaseItem');
const Sale = require('./src/models/Sale');
const SaleItem = require('./src/models/SaleItem');
const StockHistory = require('./src/models/StockHistory');
const Staff = require('./src/models/Staff');
const Expense = require('./src/models/Expense');

// Colors for console
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m"
};

const log = (msg, color = colors.reset) => console.log(`${color}${msg}${colors.reset}`);

const seedData = async () => {
  try {
    log('🌱 Connecting to Database...', colors.blue);
    await mongoose.connect(process.env.MONGODB_URI);
    log('✅ Connected to MongoDB', colors.green);

    // 1. Wipe DB
    log('⚠️ Wiping existing data...', colors.yellow);
    await User.deleteMany({});
    await Shop.deleteMany({});
    await Settings.deleteMany({});
    await Category.deleteMany({});
    await Brand.deleteMany({});
    await Customer.deleteMany({});
    await Supplier.deleteMany({});
    await Product.deleteMany({});
    await Purchase.deleteMany({});
    await PurchaseItem.deleteMany({});
    await Sale.deleteMany({});
    await SaleItem.deleteMany({});
    await StockHistory.deleteMany({});
    await Staff.deleteMany({});
    await Expense.deleteMany({});
    
    // Wipe Salary data
    const SalaryAdvance = require('./src/models/SalaryAdvance');
    const SalaryPayment = require('./src/models/SalaryPayment');
    await SalaryAdvance.deleteMany({});
    await SalaryPayment.deleteMany({});
    
    log('✅ Data wiped successfully', colors.green);

    // 2. Create User
    log('👤 Creating Admin User...', colors.blue);
    const adminUser = await User.create({
      fullname: 'Admin Owner',
      email: 'admin@shop.com',
      password: 'password123',
      phoneNumber: '9876543210',
      role: 'shop_owner',
      isOtpVerified: true
    });

    // 3. Create Shop
    log('🏪 Creating Shop...', colors.blue);
    const shop = await Shop.create({
      name: 'SuperMart 24/7',
      ownerId: adminUser._id,
      gstNumber: '27ABCDE1234F1Z5',
      contactNumber: '1800123456',
      email: 'contact@supermart.com',
      address: '123 Market Street, City Center',
      isActive: true
    });

    // Link shop to user
    adminUser.shopId = shop._id;
    adminUser.assignedShops = [shop._id];
    await adminUser.save();

    // 4. Create Settings
    await Settings.create({
      shopId: shop._id,
      currency: '₹',
      timezone: 'Asia/Kolkata',
      taxType: 'GST',
      receiptPrinterType: 'Thermal-80mm',
      termsAndConditions: 'Thank you for shopping with SuperMart 24/7!'
    });

    // 5. Categories & Brands
    log('📁 Creating Categories and Brands...', colors.blue);
    const catElectronics = await Category.create({ name: 'Electronics', shopId: shop._id });
    const catBeverages = await Category.create({ name: 'Beverages', shopId: shop._id });
    const catSnacks = await Category.create({ name: 'Snacks', shopId: shop._id });

    const brandSamsung = await Brand.create({ name: 'Samsung', shopId: shop._id });
    const brandCocaCola = await Brand.create({ name: 'Coca-Cola', shopId: shop._id });
    const brandLays = await Brand.create({ name: 'Lays', shopId: shop._id });

    // 6. Customers & Suppliers
    log('👥 Creating Customers and Suppliers...', colors.blue);
    const customer1 = await Customer.create({ name: 'Walk-in Customer', mobile: '0000000000', shopId: shop._id });
    const customer2 = await Customer.create({ name: 'Ramesh VIP', mobile: '9998887776', shopId: shop._id, creditLimit: 5000 });

    const supplier1 = await Supplier.create({ name: 'Mega Distributors', mobile: '1122334455', shopId: shop._id });

    // 7. Products
    log('📦 Creating Products...', colors.blue);
    const p1 = await Product.create({
      name: 'Coca-Cola 500ml',
      barcode: '11112222',
      sku: 'COK-500',
      shopId: shop._id,
      categoryId: catBeverages._id,
      brandId: brandCocaCola._id,
      purchasePrice: 30,
      sellingPrice: 40,
      mrp: 40,
      currentStock: 0,
      minStock: 50,
      unit: 'Pcs'
    });

    const p2 = await Product.create({
      name: 'Lays Magic Masala 50g',
      barcode: '33334444',
      sku: 'LAY-MM',
      shopId: shop._id,
      categoryId: catSnacks._id,
      brandId: brandLays._id,
      purchasePrice: 15,
      sellingPrice: 20,
      mrp: 20,
      currentStock: 0,
      minStock: 100,
      unit: 'Pkt'
    });

    // 8. Purchases (Restock)
    log('🛒 Simulating Purchases (Restock)...', colors.blue);
    const purchase = await Purchase.create({
      shopId: shop._id,
      supplierId: supplier1._id,
      userId: adminUser._id,
      invoiceNumber: 'PUR-1001',
      totalAmount: 4500,
      netAmount: 4500,
      paidAmount: 4500,
      paymentStatus: 'Paid'
    });

    // Add Purchase Items
    await PurchaseItem.create({
      purchaseId: purchase._id,
      productId: p1._id,
      shopId: shop._id,
      quantity: 100,
      purchasePrice: 30,
      totalPrice: 3000
    });
    
    await PurchaseItem.create({
      purchaseId: purchase._id,
      productId: p2._id,
      shopId: shop._id,
      quantity: 100,
      purchasePrice: 15,
      totalPrice: 1500
    });

    // Update Product Stock manually for seed
    p1.currentStock = 100;
    await p1.save();
    p2.currentStock = 100;
    await p2.save();

    // Add Stock History
    await StockHistory.create([
      {
        productId: p1._id,
        shopId: shop._id,
        movementType: 'Purchase',
        quantityChanged: 100,
        stockBefore: 0,
        stockAfter: 100,
        userId: adminUser._id,
        referenceId: purchase._id
      },
      {
        productId: p2._id,
        shopId: shop._id,
        movementType: 'Purchase',
        quantityChanged: 100,
        stockBefore: 0,
        stockAfter: 100,
        userId: adminUser._id,
        referenceId: purchase._id
      }
    ]);

    // 9. Sales
    log('🛍️ Simulating Sales...', colors.blue);
    const sale = await Sale.create({
      shopId: shop._id,
      customerId: customer1._id,
      userId: adminUser._id,
      invoiceNumber: 'INV-1001',
      totalAmount: 140, // (2*40) + (3*20) = 80 + 60 = 140
      netAmount: 140,
      paidAmount: 140,
      paymentMethod: 'Cash',
      paymentStatus: 'Paid',
      totalProfit: 35 // (2*10) + (3*5) = 20 + 15 = 35
    });

    // Add Sale Items
    await SaleItem.create({
      saleId: sale._id,
      productId: p1._id,
      shopId: shop._id,
      quantity: 2,
      sellingPrice: 40,
      totalPrice: 80,
      purchasePrice: 30,
      itemProfit: 20
    });

    await SaleItem.create({
      saleId: sale._id,
      productId: p2._id,
      shopId: shop._id,
      quantity: 3,
      sellingPrice: 20,
      totalPrice: 60,
      purchasePrice: 15,
      itemProfit: 15
    });

    // Update Stock
    p1.currentStock = 98;
    await p1.save();
    p2.currentStock = 97;
    await p2.save();

    // Add Stock History
    await StockHistory.create([
      {
        productId: p1._id,
        shopId: shop._id,
        movementType: 'Sale',
        quantityChanged: -2,
        stockBefore: 100,
        stockAfter: 98,
        userId: adminUser._id,
        referenceId: sale._id
      },
      {
        productId: p2._id,
        shopId: shop._id,
        movementType: 'Sale',
        quantityChanged: -3,
        stockBefore: 100,
        stockAfter: 97,
        userId: adminUser._id,
        referenceId: sale._id
      }
    ]);

    // 10. Staff
    log('👔 Creating Staff...', colors.blue);
    const staff1 = await Staff.create({
      shopId: shop._id,
      name: 'Raju Cashier',
      mobile: '9898989898',
      role: 'Cashier',
      baseSalary: 15000,
      isActive: true
    });

    const staff2 = await Staff.create({
      shopId: shop._id,
      name: 'Suresh Manager',
      mobile: '9797979797',
      role: 'Manager',
      baseSalary: 25000,
      isActive: true
    });

    // 11. Salary Advances
    log('💸 Creating Salary Advances...', colors.blue);
    
    await SalaryAdvance.create([
      {
        shopId: shop._id,
        staffId: staff1._id,
        amount: 2000,
        repaymentTerm: 'Next Salary',
        status: 'Approved',
        reason: 'Medical Emergency',
        recordedBy: adminUser._id
      },
      {
        shopId: shop._id,
        staffId: staff2._id,
        amount: 5000,
        repaymentTerm: 'EMI',
        emiAmount: 1000,
        status: 'Pending',
        reason: 'Bike Repair',
        recordedBy: adminUser._id
      }
    ]);

    // 12. Salary Payments
    log('💰 Creating Salary Payments...', colors.blue);

    await SalaryPayment.create([
      {
        shopId: shop._id,
        staffId: staff1._id,
        month: 'June',
        year: '2026',
        baseSalary: 15000,
        bonus: 500,
        deductions: 0,
        netSalary: 15500,
        paymentMethod: 'Bank Transfer',
        paymentDate: new Date('2026-06-01'),
        status: 'Paid',
        recordedBy: adminUser._id
      },
      {
        shopId: shop._id,
        staffId: staff2._id,
        month: 'June',
        year: '2026',
        baseSalary: 25000,
        bonus: 0,
        deductions: 2000,
        netSalary: 23000,
        paymentMethod: 'UPI',
        paymentDate: new Date('2026-06-01'),
        status: 'Paid',
        recordedBy: adminUser._id
      },
      {
        shopId: shop._id,
        staffId: staff1._id,
        month: 'July',
        year: '2026',
        baseSalary: 15000,
        bonus: 0,
        deductions: 0,
        netSalary: 15000,
        paymentMethod: 'Bank Transfer',
        paymentDate: new Date('2026-07-01'),
        status: 'Pending',
        recordedBy: adminUser._id
      }
    ]);

    log('🎉 SEEDING COMPLETED SUCCESSFULLY!', colors.magenta);
    log('=====================================', colors.magenta);
    log('Login Email: admin@shop.com');
    log('Password: password123');
    log('=====================================', colors.magenta);
    
    process.exit(0);
  } catch (error) {
    log(`❌ Error: ${error.stack}`, colors.red);
    process.exit(1);
  }
};

seedData();
