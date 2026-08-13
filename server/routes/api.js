const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ObjectId = mongoose.Types.ObjectId;
const addClient = require('../models/addClient');

// ======================================================
// 1. MONGODB URI
// ======================================================

const uri = process.env.MONGO_URI;

// ======================================================
// 2. MUHIM O'ZGARISH
// ======================================================

// ❌ OLDIN BUNAQA EDI:
//
// mongoose.connect(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });
//
// Bu yerda Node default DNS'dan foydalanayotgan edi.
// Sizda esa MongoDB SRV DNS'iga ulanishda ECONNREFUSED chiqyapti.


// ✅ YANGI VARIANT:
//
// Avval DNS serverlarini belgilaymiz.
// Siz terminalda aynan shu usul bilan MongoDB SRV yozuvlarini
// muvaffaqiyatli topdingiz.

const dns = require('dns');

dns.setServers([
  '8.8.8.8',
  '1.1.1.1'
]);


// ======================================================
// 3. MONGODB ULANISH
// ======================================================

mongoose
  .connect(uri)
  .then(() => {
    console.log('=================================');
    console.log('✅ MONGODB DATABASE ULANDI');
    console.log('=================================');
  })
  .catch((error) => {
    console.error('=================================');
    console.error('❌ MONGODB ULANISHDA XATO');
    console.error(error);
    console.error('=================================');
  });


// ======================================================
// 4. PRODUCT SCHEMA
// ======================================================

const productSchema = new mongoose.Schema({
  productName: String,
  turkum: String,
  olchovBirligi: String,
  oramlarNomi: String,

  // Omborga jami kelib tushgan miqdor
  oramlarSoni: Number,

  // Hozirgi qoldiq (to'liq o'ramlar soni)
  qoldiq: Number,

  // 1 o'ram ichidagi dona soni
  donaPerOram: { type: Number, default: 1 },

  // Eng kichik birlikdagi qoldiq
  qoldiqDona: { type: Number, default: 0 },

  sotishNarxi: String,
  ulgurjiNarxi: String,
  sotibOlinganNarxi: String,
  id: String,

  creationDateTime: {
    type: Date,
    default: Date.now
  },
});


// ======================================================
// 5. PRODUCT MODEL
// ======================================================

const Product = mongoose.model('Product', productSchema);


// ======================================================
// 6. PRODUCT YARATISH
// ======================================================

router.post('/products', async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,

      // Omborga kelgan jami son — O'ZGARMAYDI
      oramlarSoni: Number(req.body.oramlarSoni) || 0,

      // Boshlang'ich qoldiq
      qoldiq: Number(req.body.oramlarSoni) || 0,

      // 1 o'ramdagi dona soni
      donaPerOram: Math.max(1, Number(req.body.donaPerOram) || 1),

      // Ombordagi jami dona
      qoldiqDona:
        (Number(req.body.oramlarSoni) || 0) *
        Math.max(1, Number(req.body.donaPerOram) || 1),
    });

    const savedProduct = await newProduct.save();

    res.status(200).json({
      success: true,
      product: savedProduct,
    });

  } catch (error) {
    console.error("❌ Error in creating a product:", error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
});


// ======================================================
// 7. ROUTERNI EXPORT QILISH
// ======================================================

// Route to fetch all products
router.get('/products', async (req, res) => {
  try {
    // Fetch all products from the database
    const allProducts = await Product.find();

    // Sending a 200 OK response with the fetched products
    res.status(200).json({ success: true, products: allProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});
router.delete('/products/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    console.log('Deleting product with ID:', productId);
    // Find the product by ID and remove it
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, product: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Route to update a product

router.put('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const currentProduct = await Product.findOne({ id: productId });

    if (!currentProduct) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const updatedProductData = { ...req.body };
    const donaPerOram = Math.max(1, Number(
      updatedProductData.donaPerOram ?? currentProduct.donaPerOram ?? 1
    ));

    // O'ramlar soni asl kirim sifatida saqlanadi.
    // Tahrirlashda eski qoldiq tasodifan o'zgarmaydi.
    delete updatedProductData.qoldiq;
    delete updatedProductData.qoldiqDona;

    updatedProductData.donaPerOram = donaPerOram;

    // Agar oramlarSoni o'zgartirilmasa, mavjud qoldiq saqlanadi.
    if (updatedProductData.oramlarSoni !== undefined) {
      const newOriginal = Number(updatedProductData.oramlarSoni) || 0;
      const oldOriginal = Number(currentProduct.oramlarSoni) || 0;
      const oldQoldiqDona =
        currentProduct.qoldiqDona !== undefined && currentProduct.qoldiqDona !== null
          ? Number(currentProduct.qoldiqDona)
          : (Number(currentProduct.qoldiq) || oldOriginal) *
            Math.max(1, Number(currentProduct.donaPerOram) || 1);

      // Yangi son eski kirimdan katta bo'lsa, farq yangi kirim deb qo'shiladi.
      const addedOram = Math.max(0, newOriginal - oldOriginal);
      updatedProductData.qoldiqDona = oldQoldiqDona + addedOram * donaPerOram;
      updatedProductData.qoldiq = Math.floor(
        updatedProductData.qoldiqDona / donaPerOram
      );
    } else {
      const currentQoldiqDona =
        currentProduct.qoldiqDona !== undefined && currentProduct.qoldiqDona !== null
          ? Number(currentProduct.qoldiqDona)
          : (Number(currentProduct.qoldiq) || Number(currentProduct.oramlarSoni) || 0) *
            Math.max(1, Number(currentProduct.donaPerOram) || 1);
      updatedProductData.qoldiqDona = currentQoldiqDona;
      updatedProductData.qoldiq = Math.floor(
        currentQoldiqDona / donaPerOram
      );
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { id: productId },
      { $set: updatedProductData },
      { new: true }
    );

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Error in updating a product:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      details: error.message,
    });
  }
});

/////////////////////////////////////////////////
const salesSchema = new mongoose.Schema({
  productNameValue: String,
  productNumber: String,
  clientName: String,
  workman: String,
  productPrice: String,
  creationDateTime: { type: Date, default: Date.now },
});

// Create a Mongoose model based on the schema
const Sales = mongoose.model('Sales', salesSchema);

// Route to create sales data
router.post('/resultSales', async (req, res) => {
  try {
    const { productNameValue, productNumber,productPrice } = req.body;

    // Find the corresponding product by productName
    const correspondingProduct = await Product.findOne({ productName: productNameValue });

    if (!correspondingProduct) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Calculate the resultNumber
   // Sotilgan miqdor
const soldQuantity = Number(productNumber) || 0;

// Eski mahsulotlarda qoldiq bo'lmasa,
// oramlarSoni'dan boshlang'ich qoldiqni olamiz
if (
  correspondingProduct.qoldiq === undefined ||
  correspondingProduct.qoldiq === null
) {
  correspondingProduct.qoldiq =
    Number(correspondingProduct.oramlarSoni) || 0;
}

// Faqat QOLDIQ kamayadi
correspondingProduct.qoldiq -= soldQuantity;

// Qoldiq manfiy bo'lib ketmasin
if (correspondingProduct.qoldiq < 0) {
  return res.status(400).json({
    success: false,
    error: "Omborda yetarli mahsulot mavjud emas",
  });
}
  
    // Save the updated product to the database
    const updatedProduct = await correspondingProduct.save();

    // Create a new Sales object with the found product and additional sales data
    const newSales = new Sales({
      productNameValue,
      productNumber,
      productPrice,
      productId: updatedProduct._id, // assuming you have an _id field in Product model
    });

    // Save the new sales data to the database
    const savedSales = await newSales.save();

 

    // Sending a 200 OK response with the created sales data
    res.status(200).json({ success: true, sales: savedSales });
  } catch (error) {
    console.error('Error in creating sales data:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

//////////////////////////////////////////////////////

// Assuming you have a client schema defined like this:
const clientSchema = new mongoose.Schema({
  clientName: String,
  dataValue: String, // Adjust according to your client data structure
  productNameValue: String,
  workman: String,
  productNumber: String,
  productPrice: String,
  selectedValue: String,
  id: String,
  creationDateTime: { type: Date, default: Date.now },
  // Add any other fields as needed
});

// Create a Mongoose model based on the schema
const Client = mongoose.model('Client', clientSchema);
///////////////////////////////////////////////////////////////////////////////////////

router.post('/clients', async (req, res) => {
  try {
    // Create a new instance of the Client model with the received data
    const newClient = new Client(req.body);

    // Save the new client to the database
    const savedClient = await newClient.save();
    console.log(savedClient);
    // Send a response back to the client
    res.status(201).json({ message: 'Client data saved successfully', data: savedClient });
  } catch (error) {
    // Handle errors
    console.error('Error saving client data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////

router.get('/clients', async (req, res) => {
  try {
    // Fetch all clients from the database
    const clients = await Client.find();

    // Send the array of clients as a response
    res.status(200).json({ message: 'Client data retrieved successfully', data: clients });
  } catch (error) {
    // Handle errors
    console.error('Error retrieving client data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/////////////////////////////////////////////
const userSchema = new mongoose.Schema({
  text: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Add other fields as needed
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
  }
  next();
});

const User = mongoose.model('User', userSchema);

router.post('/login', async (req, res) => {
  try {
    const { text, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ text });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Create and sign a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, token, userId: user._id });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

//////////////////////////////
router.delete('/clients/:id', async (req, res) => {
  const clientId = req.params.id;

  try {
    console.log('Deleting client with ID:', clientId);
    // Find the client by ID and remove it
    const deletedClient = await Client.findOneAndRemove({id: clientId });

    if (!deletedClient) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    res.status(200).json({ success: true, client: deletedClient });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

///////////////////////////////////////////////
// Assuming you have a supplier schema defined like this:
const supplierSchema = new mongoose.Schema({
  id: String,
  name: String,
  debt: String,
  information: String,
  phoneNumber: String,
  // Add any other fields as needed
});

// Create a Mongoose model based on the schema
const Supplier = mongoose.model('Supplier', supplierSchema);

// Route to create a supplier
router.post('/suppliers', async (req, res) => {
  try {
    const {id, name, debt, information, phoneNumber } = req.body;

    // Create a new supplier document
    const newSupplier = {
      id,
      name,
      debt,
      information,
      phoneNumber,
      // Add any other fields as needed
    };

    // Save the new supplier to the database
    const savedSupplier = await Supplier.create(newSupplier);

    // Sending a 200 OK response with the created supplier
    res.status(200).json({ success: true, supplier: savedSupplier });
  } catch (error) {
    console.error('Error in creating a supplier:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Route to fetch all suppliers
router.get('/suppliers', async (req, res) => {
  try {
    // Fetch all suppliers from the database
    const allSuppliers = await Supplier.find();

    // Sending a 200 OK response with the fetched suppliers
    res.status(200).json({ success: true, suppliers: allSuppliers });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.put('/suppliers/:id', async (req, res) => {
  try {
    const supplierId = req.params.id;
    const updatedSupplierData = req.body;

    
    const updatedSupplier = await Supplier.findOneAndUpdate(
      { id: supplierId },
      { $set: updatedSupplierData },
      { new: true }
    );

    if (!updatedSupplier) {
      // If the supplier is not found, return a 404 Not Found response
      return res.status(404).json({ success: false, error: 'Supplier not found' });
    }

    // Sending a 200 OK response with the updated supplier
    res.status(200).json({ success: true, supplier: updatedSupplier });
  } catch (error) {
    console.error('Error in updating a supplier:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.delete('/suppliers/:id', async (req, res) => {
  try {
    const supplierId = req.params.id;

    // Find the supplier by ID and delete
    const deletedSupplier = await Supplier.findOneAndDelete({ id: supplierId });

    if (!deletedSupplier) {
      // If the supplier is not found, return a 404 Not Found response
      return res.status(404).json({ success: false, error: 'Supplier not found' });
    }

    // Return a success response with the deleted supplier
    res.status(200).json({ success: true, supplier: deletedSupplier });
  } catch (error) {
    console.error('Error in deleting a supplier:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.post('/addClients', async (req, res) => {
  try {
    const newClientData = req.body;

    // Create a new client document
    const newClient = await addClient.create(newClientData);

    // Sending a 200 OK response with the created client
    res.status(200).json({ success: true, client: newClient });
  } catch (error) {
    console.error('Error in creating a client:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.get('/getClients', async (req, res) => {
  try {
    // Fetch all clients from the database
    const allClients = await addClient.find();
    // Sending a 200 OK response with the fetched clients
    res.status(200).json({ success: true, clients: allClients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

///////////////////////////////////////////

const saveListSchema = new mongoose.Schema({

  saleId: {
    type: String,
    required: true
  },

  id: String,

  clientName: String,

  dataValue: String,

  productNumber: Number,

  productPrice: Number,

  // Jami sotuv
  totalValue: Number,

  workman: String,

  // Naqd to'lov
  clientValue: Number,

  // Plastik to'lov
  plasticValue: Number,

  // Jami to'langan
  selectedValue: Number,

  // Qarz
  debtValue: Number,

  // To'lov holati
  isPaid: {
    type: Boolean,
    default: false
  },

  // Barcha sotilgan mahsulotlar
  products: [
    {
      productName: String,

      productNumber: Number,

      productPrice: Number,

      totalPrice: Number,
    }
  ],

  creationDateTime: {
    type: Date,
    default: Date.now
  },

});

const Save = mongoose.model('Save', saveListSchema);

router.post('/saveList', async (req, res) => {
  try {
    let salesData = req.body;

    if (Array.isArray(salesData)) {
      salesData = salesData[0];
    }

    const saleId = salesData.saleId || salesData.id;

    if (!saleId) {
      return res.status(400).json({
        success: false,
        error: "saleId yoki id mavjud emas",
      });
    }

    if (
      !Array.isArray(salesData.products) ||
      salesData.products.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: "products mavjud emas yoki bo'sh",
      });
    }

    // ==========================================
    // 1. AVVAL BARCHA MAHSULOTLARNI TEKSHIRAMIZ
    // ==========================================

    const preparedProducts = [];

    for (const rawProduct of salesData.products) {
      const productName =
        rawProduct.productName ||
        rawProduct.productNameValue ||
        rawProduct.name ||
        "";

      const quantity = Number(
        rawProduct.productNumber ??
        rawProduct.quantity ??
        0
      );

      if (!productName || quantity <= 0) {
        return res.status(400).json({
          success: false,
          error: "Mahsulot nomi yoki soni noto'g'ri",
        });
      }

      // Mahsulotni topamiz
      const product = await Product.findOne({
        productName,
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Mahsulot topilmadi: ${productName}`,
        });
      }

      // ==========================================
      // MAHSULOT BIRLIKLARI
      // ==========================================

      const olchovBirligi =
        product.olchovBirligi || "dona";

      const oramlarNomi =
        product.oramlarNomi || "quti";

      const perOram = Math.max(
        1,
        Number(product.donaPerOram) || 1
      );

      // ==========================================
      // SOTUV BIRLIGI
      // ==========================================

      const saleUnit =
        rawProduct.saleUnit || olchovBirligi;

      // ==========================================
      // OMBORDAGI ENG KICHIK BIRLIK QOLDIG'I
      //
      // qoldiqDona:
      //
      // dona
      // kg
      // m
      //
      // kabi asosiy birlikda saqlanadi.
      // ==========================================

      let currentStockDona = 0;

      if (
        product.qoldiqDona !== undefined &&
        product.qoldiqDona !== null
      ) {
        currentStockDona =
          Number(product.qoldiqDona) || 0;
      } else {
        currentStockDona =
          (Number(product.qoldiq) || 0) *
          perOram;
      }

      // ==========================================
      // SOTILAYOTGAN MIQDORNI HISOBLASH
      // ==========================================

      let stockQuantity = 0;

      /*
       * Agar o'ram bilan sotilsa:
       *
       * 3 qop × 10 kg = 30 kg
       *
       * 5 quti × 12 dona = 60 dona
       */

      if (saleUnit === oramlarNomi) {
        stockQuantity =
          quantity * perOram;
      }

      /*
       * Agar asosiy birlikda sotilsa:
       *
       * 20 kg = 20 kg
       * 5 m = 5 m
       * 10 dona = 10 dona
       */

      else {
        stockQuantity = quantity;
      }

      // ==========================================
      // QOLDIQNI TEKSHIRISH
      // ==========================================

      if (stockQuantity > currentStockDona) {
        const availableOram = Math.floor(
          currentStockDona / perOram
        );

        const availableLoose =
          currentStockDona % perOram;

        return res.status(400).json({
          success: false,
          error:
            `Omborda "${productName}" uchun yetarli ` +
            `mahsulot yo'q. ` +
            `Qoldiq: ${currentStockDona} ${olchovBirligi}` +
            ` (${availableOram} ${oramlarNomi}` +
            (
              availableLoose > 0
                ? ` + ${availableLoose} ${olchovBirligi}`
                : ""
            ) +
            `).`,
        });
      }

      // ==========================================
      // TAYYOR MA'LUMOT
      // ==========================================

      preparedProducts.push({
        product,
        productName,
        quantity,
        saleUnit,
        olchovBirligi,
        oramlarNomi,
        perOram,
        currentStockDona,
        stockQuantity,

        productPrice:
          Number(rawProduct.productPrice) || 0,

        totalPrice:
          Number(rawProduct.totalPrice) ||
          Number(rawProduct.totalValue) ||
          0,
      });
    }

    // ==========================================
    // 2. QOLDIQNI KAMAYTIRAMIZ
    // ==========================================

    for (const item of preparedProducts) {
      const newStockDona =
        item.currentStockDona -
        item.stockQuantity;

      /*
       * Asosiy qoldiq:
       *
       * 500 kg - 30 kg = 470 kg
       *
       * 1000 m - 50 m = 950 m
       *
       * 300 dona - 20 dona = 280 dona
       */

      item.product.qoldiqDona =
        newStockDona;

      /*
       * To'liq o'ramlar soni:
       *
       * 470 kg / 10 kg = 47 qop
       */

      item.product.qoldiq =
        Math.floor(
          newStockDona / item.perOram
        );

      /*
       * Muhim:
       *
       * oramlarSoni o'zgarmaydi.
       *
       * Chunki u omborga jami kelgan
       * boshlang'ich miqdorni bildiradi.
       */

      await item.product.save();
    }

    // ==========================================
    // 3. SOTUV MAHSULOTLARINI TAYYORLAYMIZ
    // ==========================================

    const products = preparedProducts.map(
      (item) => ({
        productName:
          item.productName,

        productNumber:
          item.quantity,

        productPrice:
          item.productPrice,

        totalPrice:
          item.totalPrice,

        saleUnit:
          item.saleUnit,

        olchovBirligi:
          item.olchovBirligi,

        oramlarNomi:
          item.oramlarNomi,

        donaPerOram:
          item.perOram,

        stockQuantity:
          item.stockQuantity,
      })
    );

    // ==========================================
    // 4. SOTUVNI SAQLASH
    // ==========================================

    const saveInstance = new Save({
      saleId,

      id:
        salesData.id ||
        saleId,

      clientName:
        salesData.clientName || "",

      dataValue:
        salesData.dataValue || "",

      productNumber:
        Number(salesData.productNumber) || 0,

      productPrice:
        Number(salesData.productPrice) || 0,

      totalValue:
        Number(salesData.totalValue) ||
        Number(salesData.productPrice) ||
        0,

      workman:
        salesData.workman || "",

      clientValue:
        Number(salesData.clientValue) || 0,

      plasticValue:
        Number(salesData.plasticValue) || 0,

      selectedValue:
        Number(salesData.selectedValue) || 0,

      debtValue:
        Number(salesData.debtValue) || 0,

      isPaid:
        Boolean(salesData.isPaid),

      products,
    });

    const savedData =
      await saveInstance.save();

    // ==========================================
    // 5. JAVOB
    // ==========================================

    return res.status(201).json({
      success: true,
      savedData,
    });

  } catch (error) {
    console.error(
      "❌ SAVE LIST XATO:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

router.get('/getList', async (req, res) => {
  try {
    const salesData = await Save.find(); 

    res.status(200).json({ success: true, salesArray: salesData });
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.delete('/client/:id', async (req, res) => {
  const clientId = req.params.id;

  try {
    console.log('Deleting client with ID:', clientId);
    const deletedClient = await Save.findOneAndRemove({id: clientId });

    if (!deletedClient) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    res.status(200).json({ success: true, client: deletedClient });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.post('/updateSelectedValue/:id', async (req, res) => {
  const clientId = req.params.id;

  try {
    const { selectedValue } = req.body;

    // Assuming you want to update the selected value for a specific client by their ID
    const updatedClient = await Save.findOneAndUpdate(
      { id: clientId },
      { selectedValue: selectedValue },
      { new: true } // Return the updated document
    );

    if (!updatedClient) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    res.status(200).json({ success: true, updatedClient });
  } catch (error) {
    console.error('Error updating selected value:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});





module.exports = router;