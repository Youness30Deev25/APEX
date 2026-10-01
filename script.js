/**
 * SA-MP Mapping Store - Client Controller Script
 * Integrated with Secure Backend Architecture & Firebase Modular SDK
 */

const appState = {
    currentUser: null,
    isAdmin: false,
    products: [],
    cart: JSON.parse(localStorage.getItem('samp_cart') || '[]'),
    activeCoupon: null,
    authMode: 'login',
    firebaseApp: null,
    auth: null,
    db: null,
    functions: null
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const firebaseConfig = {
            apiKey: "YOUR_FIREBASE_API_KEY",
            authDomain: "samp-mapping.firebaseapp.com",
            projectId: "samp-mapping",
            storageBucket: "samp-mapping.appspot.com",
            messagingSenderId: "1234567890",
            appId: "1:1234567890:web:abcdef123456"
        };

        const { initializeApp, getAuth, getFirestore, getFunctions, onAuthStateChanged } = window.FirebaseSDK;

        appState.firebaseApp = initializeApp(firebaseConfig);
        appState.auth = getAuth(appState.firebaseApp);
        appState.db = getFirestore(appState.firebaseApp);
        appState.functions = getFunctions(appState.firebaseApp);

        onAuthStateChanged(appState.auth, async (user) => {
            if (user) {
                appState.currentUser = user;
                try {
                    const idTokenResult = await user.getIdTokenResult(true);
                    appState.isAdmin = !!idTokenResult.claims.admin;
                } catch (e) {
                    appState.isAdmin = false;
                }
                auth.updateUIForLoggedInUser(user);
            } else {
                appState.currentUser = null;
                appState.isAdmin = false;
                auth.updateUIForLoggedOutUser();
            }
        });

        await shop.loadProducts();
        cart.updateBadge();

    } catch (err) {
        console.error("Initialization Error:", err);
        app.showToast("حدث خطأ أثناء الاتصال بالخادم", "error");
    }
});

const app = {
    navigateTo(viewName) {
        document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
        const targetView = document.getElementById(`${viewName}View`);
        if (targetView) targetView.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    toggleMobileMenu() {
        document.getElementById('navMenu').classList.toggle('show');
    },
    showToast(message, type = 'info') {
        const container = document.getElementById('alertContainer');
        const toast = document.createElement('div');
        toast.className = `toast-alert toast-${type}`;
        toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }
};

const shop = {
    async loadProducts() {
        try {
            const response = await fetch('products-seed.json');
            appState.products = await response.json();
            this.renderProducts(appState.products);
            this.renderFeatured(appState.products.filter(p => p.featured));
        } catch (err) {
            console.error("Error loading products:", err);
        }
    },
    renderProducts(items) {
        const grid = document.getElementById('shopProductsGrid');
        if (!grid) return;
        grid.innerHTML = items.map(p => `
            <div class="product-card">
                <div class="product-card-image">
                    <img src="${p.image}" alt="${p.title}" loading="lazy">
                    <div class="product-badges">
                        <span class="badge ${p.type === 'free' ? 'badge-free' : 'badge-premium'}">${p.type === 'free' ? 'مجاني' : 'مدفوع'}</span>
                        ${p.discount > 0 ? `<span class="badge badge-discount">خصم ${p.discount}%</span>` : ''}
                    </div>
                </div>
                <div class="product-card-body">
                    <h3 class="product-card-title">${p.title}</h3>
                    <div class="product-meta-row">
                        <span><i class="fa-solid fa-cubes"></i> ${p.objects} عنصر</span>
                        <span><i class="fa-solid fa-star text-warning"></i> ${p.rating || '5.0'}</span>
                    </div>
                    <p class="product-card-desc">${p.description}</p>
                    <div class="product-card-footer">
                        <div class="product-price-box"><span class="price-current">${p.type === 'free' ? 'مجاناً' : '$' + p.price}</span></div>
                        <button class="btn btn-primary btn-sm" onclick="shop.viewDetails('${p.id}')">المعاينة والتفاصيل</button>
                    </div>
                </div>
            </div>
        `).join('');
    },
    renderFeatured(items) {
        const grid = document.getElementById('featuredProductsGrid');
        if (!grid) return;
        grid.innerHTML = items.slice(0, 3).map(p => `
            <div class="product-card">
                <div class="product-card-image"><img src="${p.image}" alt="${p.title}"></div>
                <div class="product-card-body"><h3>${p.title}</h3><p class="product-card-desc">${p.description}</p><button class="btn btn-outline-primary btn-block" onclick="shop.viewDetails('${p.id}')">عرض التفاصيل</button></div>
            </div>
        `).join('');
    },
    filterProducts() {
        const query = document.getElementById('shopSearchInput').value.toLowerCase();
        const cat = document.getElementById('categoryFilter').value;
        const sort = document.getElementById('sortOrder').value;
        let filtered = appState.products.filter(p => {
            const matchesQuery = p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
            const matchesCat = cat === 'all' || (cat === 'free' && p.type === 'free') || (cat === 'premium' && p.type === 'paid') || (cat === 'discount' && p.discount > 0);
            return matchesQuery && matchesCat;
        });
        if (sort === 'price-asc') filtered.sort((a,b) => a.price - b.price);
        if (sort === 'price-desc') filtered.sort((a,b) => b.price - a.price);
        this.renderProducts(filtered);
    },
    viewDetails(productId) {
        const p = appState.products.find(x => x.id === productId);
        if (!p) return;
        const container = document.getElementById('productDetailsContainer');
        container.innerHTML = `
            <div class="product-details-grid">
                <div class="details-media-box">
                    <img src="${p.image}" alt="${p.title}">
                    ${p.youtubeId ? `<div style="margin-top:20px;"><h3>عرض بالفيديو</h3><iframe width="100%" height="250" src="https://www.youtube.com/embed/${p.youtubeId}" frameborder="0" allowfullscreen style="border-radius:10px;"></iframe></div>` : ''}
                </div>
                <div class="details-info-box">
                    <h1>${p.title}</h1>
                    <p class="text-muted">${p.description}</p>
                    <div class="details-spec-list">
                        <div class="spec-item"><i class="fa-solid fa-cubes"></i> <strong>الأوبجكتات:</strong> ${p.objects}</div>
                        <div class="spec-item"><i class="fa-solid fa-trash"></i> <strong>الإزالات:</strong> ${p.removals}</div>
                        <div class="spec-item"><i class="fa-solid fa-plug"></i> <strong>المتطلبات:</strong> ${p.requirements}</div>
                        <div class="spec-item"><i class="fa-solid fa-star text-warning"></i> <strong>التقييم:</strong> ${p.rating || '5.0'}</div>
                    </div>
                    <div class="details-price-area" style="margin: 20px 0;"><span class="price-current" style="font-size:28px;">${p.type === 'free' ? 'مجاناً' : '$' + p.price}</span></div>
                    <div class="details-actions">
                        ${p.type === 'free' ? `<a href="${p.downloadUrl}" target="_blank" class="btn btn-primary btn-lg btn-block"><i class="fa-solid fa-download"></i> تحميل مجاني مباشر</a>` : `<button class="btn btn-primary btn-lg btn-block" onclick="cart.addItem('${p.id}')"><i class="fa-solid fa-cart-plus"></i> إضافة إلى السلة</button>`}
                    </div>
                </div>
            </div>
        `;
        app.navigateTo('productDetails');
    }
};

const cart = {
    toggleModal() {
        document.getElementById('cartModalBackdrop').classList.toggle('hidden');
        this.renderDrawer();
    },
    closeModalOutside(e) {
        if (e.target.id === 'cartModalBackdrop') this.toggleModal();
    },
    addItem(productId) {
        const p = appState.products.find(x => x.id === productId);
        if (!p) return;
        if (appState.cart.some(item => item.id === productId)) {
            app.showToast("المنتج موجود بالفعل في سلة التسوق", "warning");
            return;
        }
        appState.cart.push(p);
        this.saveCart();
        app.showToast("تمت إضافة الخريطة إلى السلة", "success");
    },
    removeItem(productId) {
        appState.cart = appState.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.renderDrawer();
    },
    saveCart() {
        localStorage.setItem('samp_cart', JSON.stringify(appState.cart));
        this.updateBadge();
    },
    updateBadge() {
        document.getElementById('cartBadge').innerText = appState.cart.length;
    },
    renderDrawer() {
        const container = document.getElementById('cartItemsContainer');
        if (appState.cart.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">سلة التسوق فارغة حالياً.</p>';
            document.getElementById('cartSubtotal').innerText = '$0.00';
            document.getElementById('cartTotal').innerText = '$0.00';
            return;
        }
        let subtotal = 0;
        container.innerHTML = appState.cart.map(item => {
            subtotal += item.price;
            return `<div class="cart-item"><img src="${item.image}" class="cart-item-img"><div class="cart-item-info"><h4>${item.title}</h4><span class="price-current">$${item.price}</span></div><button class="close-btn" onclick="cart.removeItem('${item.id}')">&times;</button></div>`;
        }).join('');
        let total = subtotal;
        if (appState.activeCoupon) {
            const discountAmount = subtotal * (appState.activeCoupon.discountPercent / 100);
            total = subtotal - discountAmount;
            document.getElementById('discountRow').classList.remove('hidden');
            document.getElementById('cartDiscount').innerText = `-$${discountAmount.toFixed(2)}`;
        } else {
            document.getElementById('discountRow').classList.add('hidden');
        }
        document.getElementById('cartSubtotal').innerText = `$${subtotal.toFixed(2)}`;
        document.getElementById('cartTotal').innerText = `$${total.toFixed(2)}`;
    },
    async applyCoupon() {
        const code = document.getElementById('couponCodeInput').value.trim();
        if (!code) return;
        try {
            const { httpsCallable } = window.FirebaseSDK;
            const validateCouponFn = httpsCallable(appState.functions, 'validateCoupon');
            const res = await validateCouponFn({ couponCode: code });
            if (res.data.valid) {
                appState.activeCoupon = res.data;
                document.getElementById('couponMessage').innerText = `تم تطبيق الخصم: ${res.data.discountPercent}%`;
                app.showToast("تم تطبيق الكوبون بنجاح", "success");
                this.renderDrawer();
            }
        } catch (err) {
            app.showToast("رمز الكوبون غير صالحة أو منتهي", "error");
        }
    },
    async processCheckout() {
        if (!appState.currentUser) {
            app.showToast("يرجى تسجيل الدخول أولاً لإتمام الشراء", "warning");
            auth.openAuthModal('login');
            return;
        }
        if (appState.cart.length === 0) return;
        try {
            app.showToast("جاري إعداد جلسة الدفع الآمنة...", "info");
            const { httpsCallable } = window.FirebaseSDK;
            const createCheckoutSessionFn = httpsCallable(appState.functions, 'createCheckoutSession');
            const response = await createCheckoutSessionFn({
                items: appState.cart.map(i => ({ id: i.id })),
                couponCode: appState.activeCoupon ? appState.activeCoupon.code : null
            });
            if (response.data.checkoutUrl) window.location.href = response.data.checkoutUrl;
        } catch (err) {
            console.error("Checkout Error:", err);
            app.showToast("فشل إنشاء جلسة الدفع، حاول مجدداً", "error");
        }
    }
};

const auth = {
    openAuthModal(mode = 'login') {
        appState.authMode = mode;
        this.updateModalUI();
        document.getElementById('authModalBackdrop').classList.remove('hidden');
    },
    closeModal() { document.getElementById('authModalBackdrop').classList.add('hidden'); },
    toggleAuthMode(e) {
        e.preventDefault();
        appState.authMode = appState.authMode === 'login' ? 'register' : 'login';
        this.updateModalUI();
    },
    updateModalUI() {
        const isLogin = appState.authMode === 'login';
        document.getElementById('authModalTitle').innerText = isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد';
        document.getElementById('authSubmitBtn').innerText = isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب';
        document.getElementById('authSwitchPrompt').innerText = isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟';
        document.getElementById('authSwitchLink').innerText = isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول';
        document.getElementById('nameFieldGroup').style.display = isLogin ? 'none' : 'block';
    },
    async handleFormSubmit(e) {
        e.preventDefault();
        const email = document.getElementById('authEmailInput').value;
        const password = document.getElementById('authPasswordInput').value;
        const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = window.FirebaseSDK;
        try {
            if (appState.authMode === 'login') await signInWithEmailAndPassword(appState.auth, email, password);
            else await createUserWithEmailAndPassword(appState.auth, email, password);
            app.showToast(appState.authMode === 'login' ? "تم تسجيل الدخول بنجاح" : "تم إنشاء الحساب بنجاح", "success");
            this.closeModal();
        } catch (err) {
            app.showToast("خطأ في عملية تسجيل الدخول/إنشاء الحساب", "error");
        }
    },
    async logout() {
        const { signOut } = window.FirebaseSDK;
        await signOut(appState.auth);
        app.navigateTo('home');
        app.showToast("تم تسجيل الخروج", "info");
    },
    updateUIForLoggedInUser(user) {
        document.getElementById('userActionContainer').innerHTML = `<button class="btn btn-secondary btn-sm" onclick="app.navigateTo('account')"><i class="fa-solid fa-user"></i> حسابي</button>`;
        document.getElementById('userNameDisplay').innerText = user.email.split('@')[0];
        document.getElementById('userEmailDisplay').innerText = user.email;
        document.getElementById('userAvatar').innerText = user.email.charAt(0).toUpperCase();
        if (appState.isAdmin) {
            document.getElementById('adminBadge').classList.remove('hidden');
            document.getElementById('adminTabBtn').classList.remove('hidden');
        }
    },
    updateUIForLoggedOutUser() {
        document.getElementById('userActionContainer').innerHTML = `<button class="btn btn-outline-primary btn-sm" onclick="auth.openAuthModal('login')"><i class="fa-solid fa-right-to-bracket"></i> تسجيل الدخول</button>`;
        document.getElementById('adminBadge').classList.add('hidden');
        document.getElementById('adminTabBtn').classList.add('hidden');
    }
};

const account = {
    switchTab(tabName) {
        document.querySelectorAll('.account-tab').forEach(t => t.classList.add('hidden'));
        document.querySelectorAll('.account-nav-btn').forEach(b => b.classList.remove('active'));
        const targetTab = document.getElementById(`accountTab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
        if (targetTab) targetTab.classList.remove('hidden');
        if (tabName === 'purchases') this.loadPurchases();
        if (tabName === 'orders') this.loadOrders();
        if (tabName === 'admin') admin.loadAdminDashboard();
    },
    async loadPurchases() {
        try {
            const { httpsCallable } = window.FirebaseSDK;
            const getUserPurchasesFn = httpsCallable(appState.functions, 'getUserPurchases');
            const res = await getUserPurchasesFn();
            const container = document.getElementById('purchasesList');
            if (!res.data.purchases || res.data.purchases.length === 0) {
                container.innerHTML = '<p class="text-muted">لم تقم بشراء أي خرائط مدفوعة بعد.</p>';
                return;
            }
            container.innerHTML = res.data.purchases.map(p => `<div class="product-card"><div class="product-card-body"><h3>${p.title}</h3><p class="text-muted">تاريخ الشراء: ${new Date(p.purchasedAt).toLocaleDateString('ar-EG')}</p><button class="btn btn-primary btn-block" style="margin-top:15px;" onclick="account.downloadPaidMap('${p.id}')"><i class="fa-solid fa-download"></i> تحميل آمن مؤقت</button></div></div>`).join('');
        } catch (err) {
            console.error("Error fetching purchases:", err);
            document.getElementById('purchasesList').innerHTML = '<p class="text-muted">حدث خطأ أثناء جلب المشتريات.</p>';
        }
    },
    async loadOrders() {
        try {
            const { httpsCallable } = window.FirebaseSDK;
            const getUserOrdersFn = httpsCallable(appState.functions, 'getUserOrders');
            const res = await getUserOrdersFn();
            const tbody = document.getElementById('ordersTableBody');
            if (!res.data.orders || res.data.orders.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">لا توجد طلبات سابقة.</td></tr>';
                return;
            }
            tbody.innerHTML = res.data.orders.map(o => `<tr><td>#${o.id.substring(0, 8)}</td><td>${new Date(o.createdAt).toLocaleDateString('ar-EG')}</td><td>$${o.total.toFixed(2)}</td><td><span class="badge ${o.status === 'paid' ? 'badge-free' : 'badge-discount'}">${o.status}</span></td></tr>`).join('');
        } catch (err) { console.error("Error fetching orders:", err); }
    },
    async downloadPaidMap(productId) {
        try {
            app.showToast("جاري التحقق وإنشاء رابط تحميل آمن...", "info");
            const { httpsCallable } = window.FirebaseSDK;
            const generateDownloadUrlFn = httpsCallable(appState.functions, 'generateDownloadUrl');
            const res = await generateDownloadUrlFn({ productId });
            if (res.data.downloadUrl) window.open(res.data.downloadUrl, '_blank');
        } catch (err) {
            app.showToast("فشل التحقق من ملكية المنتج للتحميل", "error");
        }
    }
};

const reviewSystem = {
    currentRating: 5,
    setRating(r) {
        this.currentRating = r;
        document.querySelectorAll('.star-rating-input i').forEach((star, idx) => {
            if (idx < r) { star.classList.remove('fa-regular'); star.classList.add('fa-solid'); }
            else { star.classList.remove('fa-solid'); star.classList.add('fa-regular'); }
        });
    },
    closeModal() { document.getElementById('reviewModal').classList.add('hidden'); },
    async submitReview(e) {
        e.preventDefault();
        app.showToast("تم إرسال تقييمك بنجاح", "success");
        this.closeModal();
    }
};

const admin = {
    openProductModal() { document.getElementById('adminProductModal').classList.remove('hidden'); },
    closeProductModal() { document.getElementById('adminProductModal').classList.add('hidden'); },
    openCouponModal() { document.getElementById('adminCouponModal').classList.remove('hidden'); },
    closeCouponModal() { document.getElementById('adminCouponModal').classList.add('hidden'); },
    togglePriceFields() {
        const type = document.getElementById('adminProdType').value;
        if (type === 'free') {
            document.getElementById('freeDownloadUrlGroup').classList.remove('hidden');
            document.getElementById('paidStoragePathGroup').classList.add('hidden');
        } else {
            document.getElementById('freeDownloadUrlGroup').classList.add('hidden');
            document.getElementById('paidStoragePathGroup').classList.remove('hidden');
        }
    },
    async loadAdminDashboard() {
        if (!appState.isAdmin) return;
        document.getElementById('statProducts').innerText = appState.products.length;
        this.renderAdminProducts();
    },
    renderAdminProducts() {
        const tbody = document.getElementById('adminProductsTableBody');
        tbody.innerHTML = appState.products.map(p => `<tr><td>${p.title}</td><td><span class="badge ${p.type === 'free' ? 'badge-free' : 'badge-premium'}">${p.type}</span></td><td>$${p.price}</td><td>${p.discount}%</td><td><span class="text-success">مفعل</span></td><td><button class="btn btn-sm btn-secondary"><i class="fa-solid fa-pen"></i></button></td></tr>`).join('');
    },
    saveProduct(e) {
        e.preventDefault();
        app.showToast("تم حفظ الخريطة بنجاح", "success");
        this.closeProductModal();
    },
    async saveCoupon(e) {
        e.preventDefault();
        const code = document.getElementById('adminCouponCode').value.trim().toUpperCase();
        const discountPercent = parseInt(document.getElementById('adminCouponDiscount').value);
        try {
            const { httpsCallable } = window.FirebaseSDK;
            const createCouponFn = httpsCallable(appState.functions, 'createCoupon');
            await createCouponFn({ code, discountPercent });
            app.showToast("تم إنشاء الكوبون بنجاح", "success");
            this.closeCouponModal();
        } catch (err) { app.showToast("فشل إنشاء الكوبون", "error"); }
    }
};
