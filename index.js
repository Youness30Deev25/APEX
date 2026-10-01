/**
 * Firebase Cloud Functions - Backend Payment Processor & Secure Asset Gateway
 * Uses Node.js + Firebase Admin SDK + Stripe Webhooks
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();

/**
 * 1. Create Checkout Session Callable Function
 * Server calculates actual product prices from DB to avoid browser price tampering.
 */
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "يجب تسجيل الدخول أولاً.");
  }

  const userId = context.auth.uid;
  const { items, couponCode } = data;

  if (!items || items.length === 0) {
    throw new functions.https.HttpsError("invalid-argument", "سلة التسوق فارغة.");
  }

  let lineItems = [];
  let subtotal = 0;
  let purchasedProductIds = [];

  for (const item of items) {
    const prodSnap = await db.collection("products").doc(item.id).get();
    if (!prodSnap.exists) continue;

    const prodData = prodSnap.data();
    if (prodData.type !== "paid") continue;

    subtotal += prodData.price;
    purchasedProductIds.push(prodData.id);

    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: prodData.title,
          images: [prodData.image]
        },
        unit_amount: Math.round(prodData.price * 100)
      },
      quantity: 1
    });
  }

  let finalAmount = subtotal;
  if (couponCode) {
    const couponSnap = await db.collection("coupons").doc(couponCode.toUpperCase()).get();
    if (couponSnap.exists && couponSnap.data().active) {
      const discount = couponSnap.data().discountPercent;
      finalAmount = subtotal - (subtotal * (discount / 100));
    }
  }

  const orderRef = await db.collection("orders").add({
    userId: userId,
    productIds: purchasedProductIds,
    subtotal: subtotal,
    total: finalAmount,
    status: "pending",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `https://samp-mapping.web.app/#account?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `https://samp-mapping.web.app/#cart`,
    metadata: {
      orderId: orderRef.id,
      userId: userId
    }
  });

  return { checkoutUrl: session.url };
});

/**
 * 2. Secure Stripe Payment Webhook
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata.orderId;
    const userId = session.metadata.userId;

    const orderRef = db.collection("orders").doc(orderId);
    await orderRef.update({
      status: "paid",
      paidAt: admin.firestore.FieldValue.serverTimestamp(),
      paymentIntentId: session.payment_intent
    });

    const orderSnap = await orderRef.get();
    const productIds = orderSnap.data().productIds;

    for (const prodId of productIds) {
      await db.collection("users").doc(userId).collection("purchases").doc(prodId).set({
        productId: prodId,
        purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
        orderId: orderId
      });
    }
  }

  res.json({ received: true });
});

/**
 * 3. Secure Temporary Download URL Generator
 */
exports.generateDownloadUrl = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "غير مصرح لك للوصول.");
  }

  const userId = context.auth.uid;
  const { productId } = data;

  const purchaseSnap = await db.collection("users").doc(userId).collection("purchases").doc(productId).get();
  if (!purchaseSnap.exists) {
    throw new functions.https.HttpsError("permission-denied", "لم تقم بشراء هذا المنتج.");
  }

  const prodSnap = await db.collection("products").doc(productId).get();
  const storagePath = prodSnap.data().storagePath;

  const file = storage.bucket().file(storagePath);
  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 15 * 60 * 1000
  });

  return { downloadUrl: url };
});

/**
 * 4. Validate Coupon
 */
exports.validateCoupon = functions.https.onCall(async (data, context) => {
  const { couponCode } = data;
  if (!couponCode) return { valid: false };

  const couponSnap = await db.collection("coupons").doc(couponCode.toUpperCase()).get();
  if (!couponSnap.exists || !couponSnap.data().active) {
    return { valid: false };
  }

  return {
    valid: true,
    code: couponCode.toUpperCase(),
    discountPercent: couponSnap.data().discountPercent
  };
});

/**
 * 5. Fetch Purchases for User
 */
exports.getUserPurchases = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "غير مصرح.");

  const purchasesSnap = await db.collection("users").doc(context.auth.uid).collection("purchases").get();
  let purchases = [];

  for (const doc of purchasesSnap.docs) {
    const prodSnap = await db.collection("products").doc(doc.id).get();
    if (prodSnap.exists) {
      purchases.push({
        id: doc.id,
        title: prodSnap.data().title,
        purchasedAt: doc.data().purchasedAt ? doc.data().purchasedAt.toDate() : new Date()
      });
    }
  }

  return { purchases };
});

/**
 * 6. Create Coupon (Admin Only)
 */
exports.createCoupon = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError("permission-denied", "صلاحيات أدمن مطلوبة.");
  }

  const { code, discountPercent } = data;
  await db.collection("coupons").doc(code.toUpperCase()).set({
    code: code.toUpperCase(),
    discountPercent: discountPercent,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { success: true };
});