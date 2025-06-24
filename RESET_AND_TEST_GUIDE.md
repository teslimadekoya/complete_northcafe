# 🔄 **COMPLETE RESET & TEST GUIDE**

## 🧹 **STEP 1: RESET EVERYTHING**

### **Clear All Data**
1. Open your browser and go to `http://localhost:3000`
2. Open Developer Tools (F12)
3. Go to Console tab
4. Copy and paste this code to reset everything:

```javascript
// Clear all localStorage data
localStorage.clear();

// Create fresh default test user
const defaultUser = {
  username: 'admin',
  email: 'admin@gmail.com',
  password: 'admin123',
  id: Date.now(),
  isMockUser: true
};

// Store the default user
localStorage.setItem('mock_users', JSON.stringify([defaultUser]));

console.log('✅ App reset complete!');
console.log('📱 Default test user: admin@gmail.com / admin123');
```

5. Press Enter to execute
6. Refresh the page

## 🧪 **STEP 2: COMPREHENSIVE TESTING**

### **🔐 Test 1: Authentication**

#### **A. Registration Test**
1. Go to `http://localhost:3000/register`
2. Fill in the form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `test123456`
   - Confirm Password: `test123456`
3. Click "Sign Up"
4. ✅ **Expected**: User is logged in and redirected to home page
5. ✅ **Expected**: Navbar shows user info instead of "Login"

#### **B. Login Test**
1. Click "Logout" in navbar
2. Go to `http://localhost:3000/login`
3. Login with default user:
   - Email: `admin@gmail.com`
   - Password: `admin123`
4. ✅ **Expected**: User is logged in and redirected to home page

#### **C. Profile Management Test**
1. Click "Manage Account" in navbar
2. Update username to: `newusername`
3. Click "Save Changes"
4. ✅ **Expected**: Username updates and navbar reflects changes
5. ✅ **Expected**: No cart data is lost

### **🛒 Test 2: Cart System**

#### **A. Add to Cart Test**
1. Go to home page (`http://localhost:3000`)
2. Find a meal and set quantity to 2
3. Click "Add to Cart"
4. ✅ **Expected**: Toast notification appears
5. ✅ **Expected**: Cart count in navbar increases to 1 (not 2 - it counts items, not portions)

#### **B. Cart Count Accuracy Test**
1. Add another meal with quantity 3
2. ✅ **Expected**: Cart count becomes 2 (number of unique items, not total portions)
3. Go to cart page and increase portions of first item to 5
4. ✅ **Expected**: Cart count remains 2 (portions don't affect item count)

#### **C. Cart Persistence Test**
1. Refresh the page
2. ✅ **Expected**: Cart count remains 2
3. ✅ **Expected**: User stays logged in

#### **D. Cart Management Test**
1. Go to `/cart`
2. ✅ **Expected**: All 2 items are displayed
3. Update quantity of first item to 3 portions
4. ✅ **Expected**: Total updates correctly, cart count still shows 2
5. Remove one item
6. ✅ **Expected**: Item is removed, cart count becomes 1

### **🍽️ Test 3: Menu System**

#### **A. Menu Display Test**
1. Go to home page
2. ✅ **Expected**: Meals are loaded and displayed
3. ✅ **Expected**: Images, prices, descriptions are visible

#### **B. Search & Filter Test**
1. Use search box to search for a meal
2. ✅ **Expected**: Results filter correctly
3. Use category dropdown
4. ✅ **Expected**: Meals filter by category

### **📦 Test 4: Checkout Flow**

#### **A. Cart to Checkout Test**
1. Ensure you have items in cart
2. Go to `/cart`
3. Fill in delivery details:
   - Delivery Type: Select any option
   - Delivery Location: Select any option
   - WhatsApp Number: `08012345678`
4. Click "Proceed to Payment"
5. ✅ **Expected**: Redirected to checkout page

#### **B. Checkout Process Test**
1. On checkout page, fill in:
   - Delivery Address: `Test Address`
   - Phone Number: `08012345678`
2. Click "Place Order"
3. ✅ **Expected**: Order is created successfully
4. ✅ **Expected**: Cart is cleared
5. ✅ **Expected**: Redirected to orders page

### **📋 Test 5: Order History**

#### **A. Order Display Test**
1. On orders page
2. ✅ **Expected**: Order appears in order history
3. Click on the order
4. ✅ **Expected**: Order details are displayed

## 🔧 **STEP 3: ERROR HANDLING TESTS**

### **A. Invalid Login Test**
1. Go to login page
2. Enter wrong password
3. ✅ **Expected**: Clear error message appears

### **B. Form Validation Test**
1. Try to register with invalid email
2. ✅ **Expected**: Validation error appears
3. Try to register with weak password
4. ✅ **Expected**: Password validation error

### **C. Network Error Test**
1. Disconnect internet
2. Try to add item to cart
3. ✅ **Expected**: App continues working with localStorage

## 📱 **STEP 4: RESPONSIVE DESIGN TEST**

### **A. Mobile View**
1. Open DevTools
2. Toggle device toolbar
3. Select mobile device
4. ✅ **Expected**: UI adapts to mobile screen

### **B. Tablet View**
1. Select tablet device
2. ✅ **Expected**: UI adapts to tablet screen

## ✅ **EXPECTED RESULTS AFTER ALL TESTS**

- [x] **Authentication**: Registration, login, profile updates work
- [x] **Cart System**: Add, update, remove, persist through refreshes
- [x] **Menu System**: Display, search, filter work
- [x] **Checkout**: Complete order flow works
- [x] **Orders**: Order history displays correctly
- [x] **Data Persistence**: All data survives page refreshes
- [x] **Error Handling**: User-friendly error messages
- [x] **Responsive Design**: Works on all screen sizes

## 🎯 **QUICK VERIFICATION COMMANDS**

```bash
# Check if app is running
curl -s http://localhost:3000 > /dev/null && echo "✅ App running" || echo "❌ App not running"

# Check for any console errors
# Open browser dev tools and check console tab
```

## 🚨 **IF SOMETHING ISN'T WORKING**

1. **Clear browser cache**: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. **Clear localStorage**: Run the reset script again
3. **Check console errors**: Look for red error messages
4. **Restart server**: Stop with Ctrl+C, then `npm start`

## 🎉 **SUCCESS CRITERIA**

Your app is working perfectly when:
- ✅ All authentication flows work
- ✅ Cart system is completely reliable
- ✅ Checkout process completes successfully
- ✅ All data persists through refreshes
- ✅ No console errors appear
- ✅ UI is responsive and accessible

**Everything should work smoothly from signup to payment!** 🚀 