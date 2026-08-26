const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ObjectId = mongoose.Types.ObjectId;
const addClient = require('../models/addClient');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token mavjud emas"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token noto'g'ri"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token yaroqsiz yoki muddati tugagan"
    });
  }
};

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
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},
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

// ======================================================
// PRODUCTS
// ======================================================

// MAHSULOT QO'SHISH
router.post('/products', authMiddleware, async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,

      // Mahsulot egasi
      userId: req.userId,

      // Omborga kelgan jami son
      oramlarSoni: Number(req.body.oramlarSoni) || 0,

      // Boshlang'ich qoldiq
      qoldiq: Number(req.body.oramlarSoni) || 0,

      // 1 o'ramdagi dona soni
      donaPerOram: Math.max(
        1,
        Number(req.body.donaPerOram) || 1
      ),

      // Ombordagi jami dona
      qoldiqDona:
        (Number(req.body.oramlarSoni) || 0) *
        Math.max(
          1,
          Number(req.body.donaPerOram) || 1
        ),
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
// BARCHA MAHSULOTLARNI OLISH
// ======================================================

router.get('/products', authMiddleware, async (req, res) => {
  try {
    const allProducts = await Product.find({
      userId: req.userId
    });

    res.status(200).json({
      success: true,
      products: allProducts
    });

  } catch (error) {
    console.error('❌ Error fetching products:', error);

    res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
});
// ======================================================
// MAHSULOTNI O'CHIRISH
// ======================================================

router.delete(
  '/products/:id',
  authMiddleware,
  async (req, res) => {

    const productId = req.params.id;

    try {

      console.log(
        'Deleting product:',
        productId,
        'User:',
        req.userId
      );

      const deletedProduct =
        await Product.findOneAndDelete({
          _id: productId,
          userId: req.userId
        });

      if (!deletedProduct) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }

      res.status(200).json({
        success: true,
        product: deletedProduct
      });

    } catch (error) {

      console.error(
        '❌ Error deleting product:',
        error
      );

      res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
    }
  }
);
// Route to update a product
router.put(
  '/products/:id',
  authMiddleware,
  async (req, res) => {
    try {
      const productId = req.params.id;

      // Faqat shu userga tegishli mahsulotni qidiramiz
      const currentProduct = await Product.findOne({
        id: productId,
        userId: req.userId
      });

      if (!currentProduct) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }

      const updatedProductData = {
        ...req.body
      };

      const donaPerOram = Math.max(
        1,
        Number(
          updatedProductData.donaPerOram ??
          currentProduct.donaPerOram ??
          1
        )
      );

      // Qoldiqni frontend o'zgartira olmaydi
      delete updatedProductData.qoldiq;
      delete updatedProductData.qoldiqDona;

      // userId ham o'zgartirilmasin
      delete updatedProductData.userId;

      updatedProductData.donaPerOram = donaPerOram;

      // Agar oramlarSoni o'zgartirilsa
      if (updatedProductData.oramlarSoni !== undefined) {

        const newOriginal =
          Number(updatedProductData.oramlarSoni) || 0;

        const oldOriginal =
          Number(currentProduct.oramlarSoni) || 0;

        const oldQoldiqDona =
          currentProduct.qoldiqDona !== undefined &&
          currentProduct.qoldiqDona !== null
            ? Number(currentProduct.qoldiqDona)
            : (
                Number(currentProduct.qoldiq) ||
                oldOriginal
              ) *
              Math.max(
                1,
                Number(currentProduct.donaPerOram) || 1
              );

        // Yangi kirim miqdori
        const addedOram = Math.max(
          0,
          newOriginal - oldOriginal
        );

        updatedProductData.qoldiqDona =
          oldQoldiqDona +
          addedOram * donaPerOram;

        updatedProductData.qoldiq =
          Math.floor(
            updatedProductData.qoldiqDona /
            donaPerOram
          );

      } else {

        // Oramlar soni o'zgarmasa
        const currentQoldiqDona =
          currentProduct.qoldiqDona !== undefined &&
          currentProduct.qoldiqDona !== null
            ? Number(currentProduct.qoldiqDona)
            : (
                Number(currentProduct.qoldiq) ||
                Number(currentProduct.oramlarSoni) ||
                0
              ) *
              Math.max(
                1,
                Number(currentProduct.donaPerOram) || 1
              );

        updatedProductData.qoldiqDona =
          currentQoldiqDona;

        updatedProductData.qoldiq =
          Math.floor(
            currentQoldiqDona /
            donaPerOram
          );
      }

      // Yana userId bilan tekshiramiz
      const updatedProduct =
        await Product.findOneAndUpdate(
          {
            id: productId,
            userId: req.userId
          },
          {
            $set: updatedProductData
          },
          {
            new: true
          }
        );

      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }

      res.status(200).json({
        success: true,
        product: updatedProduct
      });

    } catch (error) {

      console.error(
        '❌ Error in updating a product:',
        error
      );

      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        details: error.message
      });
    }
  }
);
///////////////////////////

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

// ======================================================
// JWT AUTH MIDDLEWARE
// ======================================================



User.find().then(users => {
  console.log("DATABASE USERS:", users);
});

// ======================================================
// REGISTER — YANGI USER RO'YXATDAN O'TKAZISH
// ======================================================

router.post('/register', async (req, res) => {
  try {
    const { text, password } = req.body;

    // 1. Ma'lumotlarni tekshirish
    if (!text || !password) {
      return res.status(400).json({
        success: false,
        message: "Login va parolni kiriting",
      });
    }

    // 2. User oldin mavjudligini tekshirish
    const existingUser = await User.findOne({ text });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Bu login allaqachon mavjud",
      });
    }

    // 3. Yangi user yaratish
    const newUser = new User({
      text,
      password,
    });

    // 4. Saqlash
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registratsiya muvaffaqiyatli",
      userId: newUser._id,
    });

  } catch (error) {
    console.error("❌ REGISTER XATO:", error);

    res.status(500).json({
      success: false,
      message: "Registratsiyada xatolik yuz berdi",
    });
  }
});

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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Add any other fields as needed
});

// Create a Mongoose model based on the schema
const Supplier = mongoose.model('Supplier', supplierSchema);

// Route to create a supplier
router.post('/suppliers', authMiddleware, async (req, res) => {
  try {
    const newSupplier = new Supplier({
      ...req.body,
      userId: req.userId,
    });

    const savedSupplier = await newSupplier.save();

    res.status(201).json({
      success: true,
      supplier: savedSupplier,
    });

  } catch (error) {
    console.error("❌ Supplier qo'shishda xato:", error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

// Route to fetch all suppliers
router.get('/suppliers', authMiddleware, async (req, res) => {
  try {
    const suppliers = await Supplier.find({
      userId: req.userId,
    });

    res.status(200).json({
      success: true,
      suppliers,
    });

  } catch (error) {
    console.error("❌ Supplierlarni olishda xato:", error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

router.put('/suppliers/:id', authMiddleware, async (req, res) => {
  try {
    const supplierId = req.params.id;

    const updatedSupplier = await Supplier.findOneAndUpdate(
      {
        _id: supplierId,
        userId: req.userId,
      },
      {
        $set: {
          name: req.body.name,
          debt: req.body.debt,
          information: req.body.information,
          phoneNumber: req.body.phoneNumber,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSupplier) {
      return res.status(404).json({
        success: false,
        error: "Supplier topilmadi yoki bu supplier sizga tegishli emas",
      });
    }

    res.status(200).json({
      success: true,
      supplier: updatedSupplier,
    });

  } catch (error) {
    console.error("❌ Supplierni yangilashda xato:", error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

router.delete('/suppliers/:id', authMiddleware, async (req, res) => {
  try {
    const supplierId = req.params.id;

    const deletedSupplier = await Supplier.findOneAndDelete({
      _id: supplierId,
      userId: req.userId,
    });

    if (!deletedSupplier) {
      return res.status(404).json({
        success: false,
        error: "Supplier topilmadi yoki bu supplier sizga tegishli emas",
      });
    }

    res.status(200).json({
      success: true,
      supplier: deletedSupplier,
    });

  } catch (error) {
    console.error("❌ Supplierni o'chirishda xato:", error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

router.post('/addClients', authMiddleware, async (req, res) => {
  try {
    const newClientData = {
      ...req.body,
      userId: req.userId
    };

    const newClient = await addClient.create(newClientData);

    res.status(200).json({
      success: true,
      client: newClient
    });

  } catch (error) {
    console.error('Error in creating a client:', error);

    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      details: error.message
    });
  }
});


// ======================================================
// FAQAT KIRGAN USERNING MIJOZLARI
// ======================================================

router.get('/getClients', authMiddleware, async (req, res) => {
  try {
    const allClients = await addClient.find({
      userId: req.userId
    });

    res.status(200).json({
      success: true,
      clients: allClients
    });

  } catch (error) {
    console.error('Error fetching clients:', error);

    res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
});
///////////////////////////////////////////

const saveListSchema = new mongoose.Schema({

  saleId: {
    type: String,
    required: true
  },

  id: String,
userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
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

router.post('/saveList', authMiddleware, async (req, res) => {
  try {
    let salesData = req.body;

    if (Array.isArray(salesData)) {
      salesData = salesData[0];
    }
     salesData.userId = req.userId;
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
        userId: req.userId
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
       userId: req.userId,
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

router.get('/getList', authMiddleware, async (req, res) => {
  try {
    const salesData = await Save.find({
      userId: req.userId
    });

    res.status(200).json({
      success: true,
      salesArray: salesData
    });

  } catch (error) {
    console.error('❌ Error fetching sales data:', error);

    res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
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
    const {
      selectedValue,
      cashPayment,
      bankCard,
      bankTransfer,
      otherMethods,
      loyaltyCard,
      debtValue,
      isPaid,
    } = req.body;

    const updatedClient = await Save.findOneAndUpdate(
      { id: clientId },
      {
        $set: {
          selectedValue: Number(selectedValue) || 0,
          cashPayment: Number(cashPayment) || 0,
          bankCard: Number(bankCard) || 0,
          bankTransfer: Number(bankTransfer) || 0,
          otherMethods: Number(otherMethods) || 0,
          loyaltyCard: Number(loyaltyCard) || 0,
          debtValue: Number(debtValue) || 0,
          isPaid: Boolean(isPaid),
          paymentDate: new Date(),
        },
      },
      {
        new: true,
      }
    );

    if (!updatedClient) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      updatedClient,
    });
  } catch (error) {
    console.error("Error updating payment:", error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
});



module.exports = router;