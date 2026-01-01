const _INITIAL_USERS = [
  { id:1, username: 'حذيفه', password: '1', role: 'admin', name: 'حذيفه', status: 'active' },
  // Customers
  { id:2, username: 'customer1', password: 'pass', role: 'customer', name: 'Ali Ahmed', status: 'active', email: 'ali@example.com', phone: '0795234567' },
  { id:5, username: 'customer2', password: 'pass', role: 'customer', name: 'Fatima Mohamed', status: 'active', email: 'fatima@example.com', phone: '0798765432' },
  { id:6, username: 'customer3', password: 'pass', role: 'customer', name: 'Omar Hassan', status: 'active', email: 'omar@example.com', phone: '0796543210' },
  { id:7, username: 'customer4', password: 'pass', role: 'customer', name: 'Noor Ibrahim', status: 'active', email: 'noor@example.com', phone: '0797654321' },
  { id:8, username: 'customer5', password: 'pass', role: 'customer', name: 'Sara Khalil', status: 'inactive', email: 'sara@example.com', phone: '0791234567' },
  { id:9, username: 'customer6', password: 'pass', role: 'customer', name: 'Rayan Salah', status: 'active', email: 'rayan@example.com', phone: '0799876543' },
  { id:10, username: 'customer7', password: 'pass', role: 'customer', name: 'Layla Hassan', status: 'active', email: 'layla@example.com', phone: '0792345678' },
  { id:11, username: 'customer8', password: 'pass', role: 'customer', name: 'Karim Amin', status: 'active', email: 'karim@example.com', phone: '0793456789' },
  { id:12, username: 'customer9', password: 'pass', role: 'customer', name: 'Mona Yousef', status: 'active', email: 'mona@example.com', phone: '0794567890' },
  { id:13, username: 'customer10', password: 'pass', role: 'customer', name: 'Badr Khalid', status: 'active', email: 'badr@example.com', phone: '0795678901' },
  // Stores (12 total) - مع الفئة والصورة
  { id:3, username: 'store1', password: 'pass', role: 'store', name: 'Coffee Bazaar', status: 'active', email: 'store1@example.com', phone: '0791111111', category: 'Cafés', image: 'https://picsum.photos/seed/store1/400/300', region: 'بني كنانه', demo: true },
  { id:14, username: 'store2', password: 'pass', role: 'store', name: 'Fashion Hub', status: 'active', email: 'store2@example.com', phone: '0792222222', category: 'Accessories & Gifts', image: 'https://picsum.photos/seed/store2/400/300', demo: true },
  { id:15, username: 'store3', password: 'pass', role: 'store', name: 'Tech Store', status: 'active', email: 'store3@example.com', phone: '0793333333', category: 'Accessories & Gifts', image: 'https://picsum.photos/seed/store3/400/300', demo: true },
  { id:16, username: 'store4', password: 'pass', role: 'store', name: 'Books Gallery', status: 'inactive', email: 'store4@example.com', phone: '0794444444', category: 'Stationery', image: 'https://picsum.photos/seed/store4/400/300', demo: true },
  // mark first few stores as demo data so created stores (without demo:true) show as active stores
  { id:17, username: 'store5', password: 'pass', role: 'store', name: 'Home Décor', status: 'active', email: 'store5@example.com', phone: '0795555555', category: 'Home Supplies', image: 'https://picsum.photos/seed/store5/400/300', region: 'بني كنانه', demo: true },
  { id:18, username: 'store6', password: 'pass', role: 'store', name: 'Beauty Box', status: 'active', email: 'store6@example.com', phone: '0796666666', category: 'Pharmacy', image: 'https://picsum.photos/seed/store6/400/300', demo: true },
  { id:19, username: 'store7', password: 'pass', role: 'store', name: 'Sportswear', status: 'active', email: 'store7@example.com', phone: '0797777777', category: 'Accessories & Gifts', image: 'https://picsum.photos/seed/store7/400/300', demo: true },
  { id:20, username: 'store8', password: 'pass', role: 'store', name: 'Grocery Plus', status: 'active', email: 'store8@example.com', phone: '0798888888', category: 'Restaurants', image: 'https://picsum.photos/seed/store8/400/300', region: 'بني كنانه', demo: true },
  { id:21, username: 'store9', password: 'pass', role: 'store', name: 'Jewelry World', status: 'active', email: 'store9@example.com', phone: '0799999999', category: 'Accessories & Gifts', image: 'https://picsum.photos/seed/store9/400/300', demo: true },
  { id:22, username: 'store10', password: 'pass', role: 'store', name: 'Pet Paradise', status: 'active', email: 'store10@example.com', phone: '0790000000', category: 'Home Supplies', image: 'https://picsum.photos/seed/store10/400/300', demo: true },
  { id:23, username: 'store11', password: 'pass', role: 'store', name: 'Garden Center', status: 'active', email: 'store11@example.com', phone: '0791212121', category: 'Home Supplies', image: 'https://picsum.photos/seed/store11/400/300', demo: true },
  { id:24, username: 'store12', password: 'pass', role: 'store', name: 'Electronics', status: 'active', email: 'store12@example.com', phone: '0792323232', category: 'Accessories & Gifts', image: 'https://picsum.photos/seed/store12/400/300', demo: true },
  // Drivers
  { id:4, username: 'driver1', password: 'pass', role: 'driver', name: 'Ahmad Khalil', status: 'active', email: 'driver1@example.com', phone: '0795432100' },
  { id:25, username: 'driver2', password: 'pass', role: 'driver', name: 'Waleed Ameen', status: 'active', email: 'driver2@example.com', phone: '0796789012' },
  { id:26, username: 'driver3', password: 'pass', role: 'driver', name: 'Mustafa Ali', status: 'active', email: 'driver3@example.com', phone: '0797890123' },
  { id:27, username: 'driver4', password: 'pass', role: 'driver', name: 'Hassan Salem', status: 'active', email: 'driver4@example.com', phone: '0798901234' },
  { id:28, username: 'driver5', password: 'pass', role: 'driver', name: 'Jamal Fayed', status: 'inactive', email: 'driver5@example.com', phone: '0799012345' },
  { id:29, username: 'driver6', password: 'pass', role: 'driver', name: 'Zain Malik', status: 'active', email: 'driver6@example.com', phone: '0790123456' },
  { id:30, username: 'driver7', password: 'pass', role: 'driver', name: 'Samir Hassan', status: 'active', email: 'driver7@example.com', phone: '0791357924' },
  { id:31, username: 'driver8', password: 'pass', role: 'driver', name: 'Nabil Ahmed', status: 'active', email: 'driver8@example.com', phone: '0792468135' }
  ,
  // Added regional brand stores (المراعي — السعودية, طيبة — الأردن)
  { id:32, username: 'almarai', password: 'pass', role: 'store', name: 'المراعي', status: 'active', email: 'almarai@example.com', phone: '0793334444', category: 'منتجات الالبان والبيض', image: 'https://source.unsplash.com/400x300/?milk,dairy', region: 'الرياض', demo: true },
  { id:33, username: 'taybeh', password: 'pass', role: 'store', name: 'طيبة', status: 'active', email: 'taybeh@example.com', phone: '0793335555', category: 'Grocery', image: 'https://source.unsplash.com/400x300/?grocery,supermarket', region: 'عمان', demo: true }
]

// Persisted USERS array — load from localStorage when available
function loadUsers(){
  try{
    if(typeof window !== 'undefined' && window.localStorage){
      const s = localStorage.getItem('ecom_users')
      if(s){
        return JSON.parse(s)
      }
    }
  }catch(e){
    // ignore and fall back to initial
  }
  return _INITIAL_USERS
}

export const USERS = loadUsers()

export function saveUsers(){
  try{
    if(typeof window !== 'undefined' && window.localStorage){
      localStorage.setItem('ecom_users', JSON.stringify(USERS))
    }
  }catch(e){
    // ignore
  }
}

const _INITIAL_PRODUCTS = [
  { id:1, name:{en:'Coffee Mug',ar:'كوب قهوة'}, price:12.5, image:'https://picsum.photos/seed/p1/200/150', stock: 150, sku:'CM-001', store: 'Coffee Bazaar' },
  { id:2, name:{en:'T-Shirt',ar:'تيشيرت'}, price:22, image:'https://picsum.photos/seed/p2/200/150', stock: 200, sku:'TS-001', store: 'Fashion Hub' },
  { id:3, name:{en:'Notebook',ar:'دفتر'}, price:6.9, image:'https://picsum.photos/seed/p3/200/150', stock: 500, sku:'NB-001', store: 'Books Gallery' },
  { id:4, name:{en:'Wireless Headphones',ar:'سماعات لاسلكية'}, price:45.99, image:'https://picsum.photos/seed/p4/200/150', stock: 75, sku:'WH-001', store: 'Tech Store' },
  { id:5, name:{en:'Phone Case',ar:'غطاء هاتف'}, price:8.5, image:'https://picsum.photos/seed/p5/200/150', stock: 300, sku:'PC-001', store: 'Tech Store' },
  { id:6, name:{en:'USB Cable',ar:'كابل يو اس بي'}, price:4.99, image:'https://picsum.photos/seed/p6/200/150', stock: 400, sku:'UC-001', store: 'Electronics' },
  { id:7, name:{en:'Screen Protector',ar:'حماية الشاشة'}, price:3.99, image:'https://picsum.photos/seed/p7/200/150', stock: 250, sku:'SP-001', store: 'Tech Store' },
  { id:8, name:{en:'Power Bank',ar:'مشعل الطاقة'}, price:19.99, image:'https://picsum.photos/seed/p8/200/150', stock: 100, sku:'PB-001', store: 'Electronics' },
  { id:9, name:{en:'Desk Lamp',ar:'مصباح المكتب'}, price:25.5, image:'https://picsum.photos/seed/p9/200/150', stock: 60, sku:'DL-001', store: 'Home Décor' },
  { id:10, name:{en:'Pen Set',ar:'مجموعة أقلام'}, price:14.99, image:'https://picsum.photos/seed/p10/200/150', stock: 180, sku:'PS-001', store: 'Books Gallery' },

  // Regional brand products (المراعي، طيبة) — صور افتراضية من Unsplash، أوصلتها لمتاجرهم أعلاه
  { id:11, name:{en:'Almarai Fresh Milk 1L', ar:'حليب المراعي 1ل'}, price:1.25, image:'https://source.unsplash.com/400x300/?milk,almarai', stock: 200, sku:'ALM-001', store: 'المراعي', category: 'حليب' },
  { id:12, name:{en:'Almarai Laban 500g', ar:'لبن المراعي 500غ'}, price:0.95, image:'https://source.unsplash.com/400x300/?yogurt,labneh', stock: 220, sku:'ALM-002', store: 'المراعي', category: 'منتجات الالبان والبيض' },
  { id:13, name:{en:'Almarai Cheddar 200g', ar:'جبنة شيدر المراعي 200غ'}, price:3.5, image:'https://source.unsplash.com/400x300/?cheese,cheddar', stock: 140, sku:'ALM-003', store: 'المراعي', category: 'منتجات الالبان والبيض' },
  { id:14, name:{en:'Taybeh Labneh 400g', ar:'لبنة طيبة 400غ'}, price:2.99, image:'https://source.unsplash.com/400x300/?labneh,labaneh', stock: 120, sku:'TYB-001', store: 'طيبة', category: 'منتجات الالبان والبيض' },
  { id:15, name:{en:'Taybeh Mixed Cheese 500g', ar:'جبنة مشكلة طيبة 500غ'}, price:4.5, image:'https://source.unsplash.com/400x300/?cheese,mixed', stock: 90, sku:'TYB-002', store: 'طيبة', category: 'منتجات الالبان والبيض' },
  { id:16, name:{en:'Taybeh Yogurt 1kg', ar:'زبادي طيبة 1ك'}, price:2.4, image:'https://source.unsplash.com/400x300/?yogurt', stock: 160, sku:'TYB-003', store: 'طيبة', category: 'منتجات الالبان والبيض' },
  { id:17, name:{en:'Taybeh Orange Juice 1L', ar:'عصير برتقال طيبة 1ل'}, price:1.8, image:'https://source.unsplash.com/400x300/?orange,juice', stock: 200, sku:'TYB-004', store: 'طيبة', category: 'المشروبات' },
  { id:18, name:{en:'Taybeh Butter 200g', ar:'زبدة طيبة 200غ'}, price:2.1, image:'https://source.unsplash.com/400x300/?butter', stock: 110, sku:'TYB-005', store: 'طيبة', category: 'منتجات الالبان والبيض' },

  // Additional category items
  { id:19, name:{en:'Chicken Thigh 1kg', ar:'افخاذ دجاج 1ك'}, price:4.5, image:'https://source.unsplash.com/400x300/?chicken', stock:120, sku:'MEAT-001', store: 'طيبة', category: 'الدواجن واللحوم والاسماك' },
  { id:20, name:{en:'Beef Mince 500g', ar:'لحم مفروم 500غ'}, price:6.9, image:'https://source.unsplash.com/400x300/?beef', stock:80, sku:'MEAT-002', store: 'طيبة', category: 'الدواجن واللحوم والاسماك' },

  { id:21, name:{en:'Arabic Flat Bread', ar:'خبز عربي طازج'}, price:0.5, image:'https://source.unsplash.com/400x300/?bread', stock:300, sku:'BAK-001', store: 'طيبة', category: 'مخبوزات' },
  { id:22, name:{en:'Butter Croissant', ar:'كرواسون بالزبدة'}, price:0.9, image:'https://source.unsplash.com/400x300/?croissant', stock:200, sku:'BAK-002', store: 'طيبة', category: 'مخبوزات' },

  { id:23, name:{en:'Mixed Salad Pack', ar:'سلطة مشكلة طازجة'}, price:2.5, image:'https://source.unsplash.com/400x300/?salad', stock:150, sku:'FRESH-001', store: 'طيبة', category: 'أطعمة طازجة' },
  { id:24, name:{en:'Fresh Herbs Bunch', ar:'حزمة أعشاب طازجة'}, price:1.2, image:'https://source.unsplash.com/400x300/?herbs', stock:180, sku:'FRESH-002', store: 'طيبة', category: 'أطعمة طازجة' },

  { id:25, name:{en:'Bananas 1kg', ar:'موز 1ك'}, price:1.1, image:'https://source.unsplash.com/400x300/?bananas', stock:220, sku:'FR-001', store: 'طيبة', category: 'الفواكه والخضروات' },
  { id:26, name:{en:'Tomatoes 1kg', ar:'طماطم 1ك'}, price:0.9, image:'https://source.unsplash.com/400x300/?tomatoes', stock:200, sku:'FR-002', store: 'طيبة', category: 'الفواكه والخضروات' },

  { id:27, name:{en:'Canned Tuna 185g', ar:'تونة معلبة 185غ'}, price:1.8, image:'https://source.unsplash.com/400x300/?tuna,canned', stock:160, sku:'CAN-001', store: 'طيبة', category: 'المعلبات' },
  { id:28, name:{en:'Canned Sweet Corn 400g', ar:'ذرة معلبة 400غ'}, price:1.2, image:'https://source.unsplash.com/400x300/?canned,corn', stock:180, sku:'CAN-002', store: 'طيبة', category: 'المعلبات' },

  { id:29, name:{en:'Liquid Hand Soap 500ml', ar:'صابونة سائلة 500مل'}, price:2.0, image:'https://source.unsplash.com/400x300/?soap', stock:260, sku:'PERSONAL-001', store: 'طيبة', category: 'العناية الشخصية' },
  { id:30, name:{en:'Fluoride Toothpaste 120g', ar:'معجون أسنان 120غ'}, price:1.5, image:'https://source.unsplash.com/400x300/?toothpaste', stock:300, sku:'PERSONAL-002', store: 'طيبة', category: 'العناية الشخصية' },

  { id:31, name:{en:'Face Moisturizer 50ml', ar:'كريم مرطب للوجه 50مل'}, price:5.5, image:'https://source.unsplash.com/400x300/?moisturizer', stock:140, sku:'BEAUTY-001', store: 'طيبة', category: 'الصحة والجمال' },
  { id:32, name:{en:'Perfume Spray 50ml', ar:'عطر 50مل'}, price:12.0, image:'https://source.unsplash.com/400x300/?perfume', stock:90, sku:'BEAUTY-002', store: 'طيبة', category: 'الصحة والجمال' },

  { id:33, name:{en:'Paper Towels Roll', ar:'لفافة مناديل مطبخ'}, price:1.8, image:'https://source.unsplash.com/400x300/?paper,towels', stock:200, sku:'HOME-001', store: 'طيبة', category: 'المستلزمات المنزلية' },
  { id:34, name:{en:'Dishwashing Liquid 750ml', ar:'سائل غسيل صحون 750مل'}, price:2.3, image:'https://source.unsplash.com/400x300/?dishwashing', stock:210, sku:'HOME-002', store: 'طيبة', category: 'المستلزمات المنزلية' },

  { id:35, name:{en:'Cigarettes Pack (20)', ar:'باكيت سجائر 20 حبة'}, price:3.5, image:'https://source.unsplash.com/400x300/?cigarettes', stock:120, sku:'TOB-001', store: 'طيبة', category: 'التبغ' },
  { id:36, name:{en:'Hookah Tobacco 250g', ar:'تبغ شيشة 250غ'}, price:4.0, image:'https://source.unsplash.com/400x300/?hookah,tobacco', stock:80, sku:'TOB-002', store: 'طيبة', category: 'التبغ' },

  { id:37, name:{en:'Baking Yeast 7g', ar:'خميرة خبز 7غ'}, price:0.4, image:'https://source.unsplash.com/400x300/?yeast', stock:300, sku:'COOK-001', store: 'طيبة', category: 'الطهي والخبز' },
  { id:38, name:{en:'Extra Virgin Olive Oil 500ml', ar:'زيت زيتون بكر 500مل'}, price:6.5, image:'https://source.unsplash.com/400x300/?olive,oil', stock:140, sku:'COOK-002', store: 'طيبة', category: 'الطهي والخبز' },

  { id:39, name:{en:'Greek Yogurt 500g', ar:'لبن يوناني 500غ'}, price:2.5, image:'https://source.unsplash.com/400x300/?yogurt,greek', stock:220, sku:'DAIRY-001', store: 'المراعي', category: 'منتجات الالبان والبيض' },
  { id:40, name:{en:'Feta Cheese 200g', ar:'جبنة فيتا 200غ'}, price:3.2, image:'https://source.unsplash.com/400x300/?feta,cheese', stock:160, sku:'DAIRY-002', store: 'المراعي', category: 'منتجات الالبان والبيض' },

  { id:41, name:{en:'Whole Milk 2L', ar:'حليب كامل الدسم 2ل'}, price:2.2, image:'https://source.unsplash.com/400x300/?milk,2l', stock:200, sku:'MILK-001', store: 'المراعي', category: 'حليب' },
  { id:42, name:{en:'Skim Milk 1L', ar:'حليب خالي الدسم 1ل'}, price:1.8, image:'https://source.unsplash.com/400x300/?skim,milk', stock:180, sku:'MILK-002', store: 'المراعي', category: 'حليب' },

  { id:43, name:{en:'Mineral Water 1.5L', ar:'مياه معدنية 1.5ل'}, price:0.6, image:'https://source.unsplash.com/400x300/?water', stock:300, sku:'DRINK-001', store: 'طيبة', category: 'المشروبات' },
  { id:44, name:{en:'Cola Soda 330ml', ar:'مشروب غازي 330مل'}, price:0.7, image:'https://source.unsplash.com/400x300/?soda', stock:260, sku:'DRINK-002', store: 'طيبة', category: 'المشروبات' },

  { id:45, name:{en:'Breakfast Cereal 500g', ar:'حبوب افطار 500غ'}, price:3.5, image:'https://source.unsplash.com/400x300/?cereal', stock:190, sku:'BF-001', store: 'طيبة', category: 'طعام الافطار' },
  { id:46, name:{en:'Natural Honey 250g', ar:'عسل طبيعي 250غ'}, price:4.2, image:'https://source.unsplash.com/400x300/?honey', stock:120, sku:'BF-002', store: 'طيبة', category: 'طعام الافطار' },

  { id:47, name:{en:'Protein Bar Chocolate', ar:'بار بروتين بالشوكولاتة'}, price:1.8, image:'https://source.unsplash.com/400x300/?protein,bar', stock:200, sku:'PRO-001', store: 'طيبة', category: 'البروتين والنظام الغذائي' },
  { id:48, name:{en:'Whey Protein 1kg', ar:'واي بروتين 1ك'}, price:29.99, image:'https://source.unsplash.com/400x300/?whey,protein', stock:60, sku:'PRO-002', store: 'طيبة', category: 'البروتين والنظام الغذائي' },

  { id:49, name:{en:'Baby Diapers Size 3', ar:'حفاضات للأطفال مقاس 3'}, price:6.5, image:'https://source.unsplash.com/400x300/?diapers', stock:140, sku:'KIDS-001', store: 'طيبة', category: 'ركن الاطفال' },
  { id:50, name:{en:'Baby Wipes 72pcs', ar:'مناديل مبللة للأطفال 72حبة'}, price:2.5, image:'https://source.unsplash.com/400x300/?baby,wipes', stock:200, sku:'KIDS-002', store: 'طيبة', category: 'ركن الاطفال' },

  { id:51, name:{en:'Ballpoint Pens Pack', ar:'طقم اقلام حبر'}, price:1.2, image:'https://source.unsplash.com/400x300/?pens', stock:300, sku:'OFF-001', store: 'طيبة', category: 'لوازم المكتب والالعاب' },
  { id:52, name:{en:'Children Puzzle Game', ar:'لعبة تركيب للأطفال'}, price:3.0, image:'https://source.unsplash.com/400x300/?puzzle,game', stock:120, sku:'OFF-002', store: 'طيبة', category: 'لوازم المكتب والالعاب' },

  { id:53, name:{en:'Potato Chips 120g', ar:'رقائق بطاطس 120غ'}, price:1.1, image:'https://source.unsplash.com/400x300/?chips', stock:260, sku:'SNACK-001', store: 'طيبة', category: 'الوجبات الخفيفة والشوكلاته' },
  { id:54, name:{en:'Chocolate Bar 100g', ar:'لوح شوكولاتة 100غ'}, price:1.0, image:'https://source.unsplash.com/400x300/?chocolate', stock:300, sku:'SNACK-002', store: 'طيبة', category: 'الوجبات الخفيفة والشوكلاته' },

  { id:55, name:{en:'Coffee Beans 250g', ar:'حبوب قهوة 250غ'}, price:6.0, image:'https://source.unsplash.com/400x300/?coffee,beans', stock:140, sku:'COF-001', store: 'طيبة', category: 'القهوه والشاي' },
  { id:56, name:{en:'Green Tea Box 20pcs', ar:'شاي أخضر 20 كيس'}, price:2.2, image:'https://source.unsplash.com/400x300/?green,tea', stock:200, sku:'TEA-001', store: 'طيبة', category: 'القهوه والشاي' },

  { id:57, name:{en:'Disposable Plates 20pcs', ar:'أطباق للاستعمال الواحد 20حبة'}, price:1.5, image:'https://source.unsplash.com/400x300/?disposable,plates', stock:220, sku:'ONE-001', store: 'طيبة', category: 'للاستخدام الواحد' },
  { id:58, name:{en:'Disposable Cups 50pcs', ar:'أكواب للاستعمال الواحد 50حبة'}, price:2.5, image:'https://source.unsplash.com/400x300/?disposable,cups', stock:180, sku:'ONE-002', store: 'طيبة', category: 'للاستخدام الواحد' },

  { id:59, name:{en:'Frozen Veg Mix 1kg', ar:'خضار مجمدة 1ك'}, price:3.0, image:'https://source.unsplash.com/400x300/?frozen,vegetables', stock:160, sku:'FROZ-001', store: 'طيبة', category: 'الاطعمه المجمده' },
  { id:60, name:{en:'Frozen Pizza', ar:'بيتزا مجمدة'}, price:4.5, image:'https://source.unsplash.com/400x300/?frozen,pizza', stock:120, sku:'FROZ-002', store: 'طيبة', category: 'الاطعمه المجمده' },

  { id:61, name:{en:'Vanilla Ice Cream Tub 500g', ar:'ايس كريم فانيلا 500غ'}, price:2.8, image:'https://source.unsplash.com/400x300/?vanilla,icecream', stock:140, sku:'ICE-001', store: 'طيبة', category: 'ايس كريم' },
  { id:62, name:{en:'Chocolate Ice Cream Tub 500g', ar:'ايس كريم شوكولاتة 500غ'}, price:2.9, image:'https://source.unsplash.com/400x300/?chocolate,icecream', stock:130, sku:'ICE-002', store: 'طيبة', category: 'ايس كريم' },

  { id:63, name:{en:'Tomato Sauce 500g', ar:'صلصة طماطم 500غ'}, price:1.4, image:'https://source.unsplash.com/400x300/?tomato,sauce', stock:200, sku:'SPICE-001', store: 'طيبة', category: 'التوابل والصلصات' },
  { id:64, name:{en:'Mixed Spice Jar 50g', ar:'بهارات مشكلة 50غ'}, price:1.1, image:'https://source.unsplash.com/400x300/?spices', stock:180, sku:'SPICE-002', store: 'طيبة', category: 'التوابل والصلصات' },

  { id:65, name:{en:'Laundry Powder 2kg', ar:'مسحوق غسيل 2ك'}, price:6.5, image:'https://source.unsplash.com/400x300/?laundry,detergent', stock:140, sku:'CLEAN-001', store: 'طيبة', category: 'التنظيف والغسيل' },
  { id:66, name:{en:'Multi Surface Cleaner 1L', ar:'منظف متعدد الأسطح 1ل'}, price:3.2, image:'https://source.unsplash.com/400x300/?cleaner', stock:160, sku:'CLEAN-002', store: 'طيبة', category: 'التنظيف والغسيل' },

  { id:67, name:{en:'Ready Chicken Meal', ar:'وجبة دجاج جاهزة'}, price:5.5, image:'https://source.unsplash.com/400x300/?ready,meal', stock:120, sku:'READY-001', store: 'طيبة', category: 'جاهز للاكل' },
  { id:68, name:{en:'Sushi Box 8pcs', ar:'علبة سوشي 8 قطع'}, price:7.0, image:'https://source.unsplash.com/400x300/?sushi', stock:80, sku:'READY-002', store: 'طيبة', category: 'جاهز للاكل' }
]

// Persisted PRODUCTS array — load from localStorage when available
function loadProducts(){
  try{
    if(typeof window !== 'undefined' && window.localStorage){
      const s = localStorage.getItem('ecom_products')
      if(s){
        return JSON.parse(s)
      }
    }
  }catch(e){ /* ignore and fall back to initial list */ }
  return _INITIAL_PRODUCTS.slice()
}

export const PRODUCTS = loadProducts()

export function saveProducts(){
  try{
    if(typeof window !== 'undefined' && window.localStorage){
      localStorage.setItem('ecom_products', JSON.stringify(PRODUCTS))
    }
  }catch(e){ /* ignore */ }
}

// Start with no orders — numbers should be zero until the system receives real orders
export const ORDERS = []

// Overall stats — start at zero
export const STATS = {
  totalOrders: 0,
  totalRevenue: 0,
  activeUsers: 0,
  activeStores: 0
}

// Live event emitter for simple in-memory realtime simulation
const _subs = new Set()

export function subscribe(fn){
  _subs.add(fn)
  return () => _subs.delete(fn)
}

export function emit(event){
  for(const s of _subs){
    try{ s(event) }catch(e){ /* ignore subscriber errors */ }
  }
}

// Helper getters for reactive consumers
export function getStats(){ return STATS }
export function getOrders(){ return ORDERS }
export function getUsers(){ return USERS }
export function getProducts(){ return PRODUCTS }

// Return active (non-demo) stores — created stores should not set `demo: true`
export function getActiveStores(){
  return USERS.filter(u => u.role === 'store' && u.status === 'active' && !u.demo)
}

// Simple pseudo-AI estimator for preparation time based on items, distinct products and store load
function estimatePrepMinutesAI(items = [], storeName = ''){
  const itemCount = (items||[]).reduce((s,it)=> s + (it.qty||it.quantity||1), 0)
  const distinct = new Set((items||[]).map(it => it.productId)).size || 1
  // store load: pending orders for the same store
  const pending = ORDERS.filter(o => (o.store === storeName) && (o.status !== 'delivered')).length
  // heuristic: base 3 min per item + 2 min per distinct + load penalty
  let minutes = Math.round(3 * itemCount + 2 * distinct + Math.min(30, pending * 2))
  // small random jitter to vary estimates
  minutes = minutes + (Math.floor(Math.random()*7) - 3)
  // clamp to sensible range
  minutes = Math.max(5, Math.min(90, minutes))
  return minutes
}

// Generate a 10-digit numeric order id string
function generateOrderId10(){
  return String(Math.floor(1e9 + Math.random() * 9e9))
}

// Simulate server ticks every second.
// NOTE: demo orders creation is disabled by default. Set `ENABLE_DEMO_ORDERS = true` to re-enable.
const ENABLE_DEMO_ORDERS = false
let _tickCount = 0
setInterval(()=>{
  _tickCount++
  emit({type:'tick', stats: STATS, orders: ORDERS})
  if(ENABLE_DEMO_ORDERS && _tickCount % 7 === 0){
    // create a simulated order
    const customers = USERS.filter(u=>u.role === 'customer')
    const drivers = USERS.filter(u=>u.role === 'driver')
    const customer = customers.length ? customers[Math.floor(Math.random()*customers.length)] : null
    const driver = drivers.length ? drivers[Math.floor(Math.random()*drivers.length)] : null
    if(customer){
      // pick a random number of items (1..6) for variability/testing
      const itemsCount = Math.floor(1 + Math.random()*6)
      const items = []
      let total = 0
      for(let i=0;i<itemsCount;i++){
        const product = PRODUCTS[Math.floor(Math.random()*PRODUCTS.length)]
        const qty = Math.floor(1 + Math.random()*3)
        items.push({ productId: product.id, qty })
        total += (product.price || 0) * qty
      }
      // determine store from first item's product
      const firstProd = PRODUCTS.find(p=>p.id === items[0].productId)
      const storeName = firstProd ? firstProd.store : 'Unknown'
      const storeUser = USERS.find(u => u.role === 'store' && (u.name === storeName || u.username === storeName)) || {}
      const prepMinutes = estimatePrepMinutesAI(items, storeName)
      const region = storeUser.region || ''
      const id = generateOrderId10()
      const order = { id, userId: customer.id, items, total: Math.round(total*100)/100, status: 'pending', store: storeName, driverId: driver ? driver.id : null, prepMinutes, region, estimatedReadyAt: Date.now() + prepMinutes * 60_000 }
      // create via helper so subscribers/stats are updated consistently
      const created = createOrder(order)
      // emit the legacy 'order' event used by subscribers
      emit({type:'order', order: created, stats: STATS, target: { store: storeName, driverId: driver ? driver.id : null }})
    }
  }
}, 1000)

export const CATEGORIES = [
  { id: 'offers-discounts', name: 'Offers & Discounts', icon: '🏷️', color: 'bg-red-100' },
  { id: 'restaurants', name: 'Restaurants', icon: '🍔', color: 'bg-orange-100' },
  { id: 'accessories-gifts', name: 'Accessories & Gifts', icon: '🎁', color: 'bg-pink-100' },
  { id: 'home-supplies', name: 'Home Supplies', icon: '🏠', color: 'bg-blue-100' },
  { id: 'stationery', name: 'Stationery', icon: '📝', color: 'bg-yellow-100' },
  { id: 'bakery', name: 'Bakery', icon: '🥖', color: 'bg-amber-100' },
  { id: 'delivery-service', name: 'Delivery Service', icon: '🚚', color: 'bg-green-100' },
  { id: 'sweets-desserts', name: 'Sweets & Desserts', icon: '🍰', color: 'bg-purple-100' },
  { id: 'grocery', name: 'Grocery', icon: '🛒', color: 'bg-green-200' },
  { id: 'produce', name: 'Produce (Fruits & Vegetables)', icon: '🥬', color: 'bg-lime-100' },
  { id: 'cafes', name: 'Cafés', icon: '☕', color: 'bg-amber-100' },
  { id: 'pharmacy', name: 'Pharmacy', icon: '💊', color: 'bg-cyan-100' },
  { id: 'water', name: 'Water', icon: '💧', color: 'bg-blue-200' }
]

// Surge pricing persistence & helpers
const SURGE_KEY = 'ecom_surge_config'
function loadSurgeConfig(){
  try{
    if(typeof window !== 'undefined' && window.localStorage){
      const s = localStorage.getItem(SURGE_KEY)
      if(s) return JSON.parse(s)
    }
  }catch(e){ }
  return { mode: 'off', multiplier: 1, schedule: [] }
}

export let SURGE_CONFIG = loadSurgeConfig()

export function saveSurgeConfig(){
  try{
    if(typeof window !== 'undefined' && window.localStorage){
      localStorage.setItem(SURGE_KEY, JSON.stringify(SURGE_CONFIG))
    }
  }catch(e){}
}

export function setSurgeConfig(cfg){
  SURGE_CONFIG = { ...SURGE_CONFIG, ...(cfg || {}) }
  saveSurgeConfig()
  emit({ type: 'surge', surge: SURGE_CONFIG })
  return SURGE_CONFIG
}

export function getSurgeConfig(){ return SURGE_CONFIG }

function computeSurgeMultiplierFor(order){
  try{
    if(!SURGE_CONFIG) return 1
    if(SURGE_CONFIG.mode === 'manual') return Number(SURGE_CONFIG.multiplier) || 1
    if(SURGE_CONFIG.mode === 'auto' && Array.isArray(SURGE_CONFIG.schedule)){
      const now = new Date()
      const hour = now.getHours()
      for(const s of SURGE_CONFIG.schedule){
        const appliesDay = !s.days || s.days.length === 0 || (s.days || []).includes(now.getDay())
        const start = s.start ?? 0
        const end = s.end ?? 24
        if(appliesDay && hour >= start && hour < end){
          return Number(s.multiplier) || Number(SURGE_CONFIG.multiplier) || 1
        }
      }
    }
  }catch(e){}
  return Number(SURGE_CONFIG.multiplier) || 1
}

export const REGIONS = [
  'سما الروسان',
  'حريما',
  'حبراص',
  'حرثا',
  'عقربا',
  'ملاكا',
  'الكفارات',
  'السرو',
  'الشعلة',
  'اليرموك الجديدة',
  'الزوايدة',
  'ام جزيل',
  'الفيصلية',
  'الجبة',
  'عبلين',
  'المزار',
  'السايد',
  'الرمثا',
  'بدر',
  'المزرعة'
]

// Centralized order mutation helpers to ensure subscribers are notified
export function createOrder (order) {
  const id = (order && order.id) ? String(order.id) : generateOrderId10()
  const storeName = order.store || (order.items && order.items[0] && (PRODUCTS.find(p=>p.id===order.items[0].productId)?.store)) || ''
  const prep = (order && order.prepMinutes) ? order.prepMinutes : estimatePrepMinutesAI(order.items, storeName)
  const region = (order && order.region) ? order.region : (USERS.find(u=>u.role==='store' && (u.name===storeName || u.username===storeName)) || {}).region || ''
  const date = order && order.date ? order.date : Date.now()
  const estimatedReadyAt = order && order.estimatedReadyAt ? order.estimatedReadyAt : (Date.now() + prep * 60_000)
  const newOrder = { id, ...order, prepMinutes: prep, region, date, estimatedReadyAt }
  // apply surge multiplier (end-to-end): modify order.total before persisting
  const multiplier = computeSurgeMultiplierFor(newOrder) || 1
  if(newOrder.total != null){
    newOrder.total = Math.round((Number(newOrder.total) || 0) * multiplier * 100) / 100
  }
  ORDERS.push(newOrder)
  STATS.totalOrders = (STATS.totalOrders || 0) + 1
  STATS.totalRevenue = (STATS.totalRevenue || 0) + (newOrder.total || 0)
  try{
    if(typeof window !== 'undefined' && window.localStorage){
      localStorage.setItem('app_last_order_v1', JSON.stringify(newOrder))
    }
  }catch(e){ }
  // emit 'order' for compatibility with subscribers
  emit({ type: 'order', order: newOrder, surgeMultiplier: multiplier })
  return newOrder
}

export function updateOrder (id, changes) {
  const idx = ORDERS.findIndex(o => o.id === id)
  if (idx === -1) return null
  ORDERS[idx] = { ...ORDERS[idx], ...changes }
  emit({ type: 'update', order: ORDERS[idx] })
  return ORDERS[idx]
}

// Mark an order as cancelled rather than removing it from the system
export function deleteOrder (id, meta = {}) {
  const idx = ORDERS.findIndex(o => o.id === id)
  if (idx === -1) return false
  const cancelledAt = Date.now()
  const createdAt = ORDERS[idx].date || ORDERS[idx].createdAt || 0
  const timeToPrepareMinutes = Math.max(0, Math.round((cancelledAt - createdAt) / 60000))
  ORDERS[idx] = { 
    ...ORDERS[idx], 
    status: 'cancelled', 
    cancelledAt, 
    cancelledBy: meta.by || null, 
    cancelReason: meta.reason || null,
    timeToPrepareMinutes
  }
  emit({ type: 'update', order: ORDERS[idx] })
  return true
}

// Hard remove (not used by UI by default). Keep for maintenance.
export function hardDeleteOrder(id){
  const idx = ORDERS.findIndex(o => o.id === id)
  if (idx === -1) return false
  const [removed] = ORDERS.splice(idx, 1)
  STATS.totalOrders = Math.max(0, (STATS.totalOrders || 1) - 1)
  STATS.totalRevenue = Math.max(0, (STATS.totalRevenue || 0) - (removed.total || 0))
  emit({ type: 'delete', order: removed })
  return true
}

// Seed demo orders for QA / visual testing (only if no orders exist)
(function seedDemoOrders(){
  try{
    if(ORDERS.length) return
    const now = Date.now()
    const demoOrders = [
      {
        id: '1000000001',
        userId: 2,
        items: [{ productId: 1, qty: 2 }, { productId: 5, qty: 1 }],
        total: Math.round((12.5*2 + 8.5*1) * 100)/100,
        status: 'preparing',
        store: 'Coffee Bazaar',
        phone: '0795234567',
        address: 'شارع الملك - منزل 23',
        date: now - 1000 * 60 * 30
      },
      {
        id: '1000000002',
        userId: 5,
        items: [{ productId: 11, qty: 3 }],
        total: Math.round((1.25*3) * 100)/100,
        status: 'enroute',
        store: 'المراعي',
        phone: '0798765432',
        address: 'شارع السوق - شقة 4',
        date: now - 1000 * 60 * 20,
        driverId: 4
      },
      {
        id: '1000000003',
        userId: 6,
        items: [{ productId: 4, qty: 1 }, { productId: 8, qty: 1 }],
        total: Math.round((45.99 + 19.99) * 100)/100,
        status: 'delivered',
        store: 'Tech Store',
        phone: '0796543210',
        address: 'منطقة الصناعة - متجر',
        date: now - 1000 * 60 * 60 * 2,
        driverId: 25
      },
      {
        id: '1000000004',
        userId: 9,
        items: [{ productId: 3, qty: 5 }],
        total: Math.round((6.9 * 5) * 100)/100,
        status: 'pending',
        store: 'Books Gallery',
        phone: '0799876543',
        address: 'حي الزيتون',
        date: now - 1000 * 60 * 5
      }
    ]
    for(const o of demoOrders){
      createOrder(o)
    }
  }catch(e){ /* ignore seeding errors */ }
})()
