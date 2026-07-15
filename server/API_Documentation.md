# 🍔 Cravings - API Documentation

> **Base URL:** `http://localhost:4500`
>
> **Authentication:** Cookie-based JWT (`Oreo` cookie for general auth, `kitkat` cookie for OTP auth)
>
> **Content-Type:** `application/json` (unless specified as `multipart/form-data`)

---

## 📑 Table of Contents

1. [Auth APIs](#1--auth-apis)
2. [Common APIs (All Roles)](#2--common-apis-all-roles)
3. [Public APIs](#3--public-apis)
4. [Restaurant APIs](#4--restaurant-apis)
5. [Customer APIs](#5--customer-apis)
6. [Admin APIs](#6--admin-apis)
7. [Rider APIs](#7--rider-apis)

---

## 1. 🔐 Auth APIs

**Base Path:** `/auth`

> These APIs handle user registration, login, logout, and password recovery for all user types (admin, customer, rider, restaurant).

| Components | API Endpoints | Description | Request Body | Response Body | Success Message | Error Message |
|---|---|---|---|---|---|---|
| Register | `POST /auth/register` | Register a new user (customer / restaurant / rider) | `{ fullName: String, email: String, password: String, phone: String, gender: String, dob: Date, userType: "admin" \| "customer" \| "rider" \| "restaurant" }` | `{ message: String }` | `"User Created Successfully"` | `"All fields Required"` (400), `"Email already registred"` (409) |
| Login | `POST /auth/login` | Login an existing user and set JWT cookie | `{ email: String, password: String }` | `{ message: String, data: { _id, fullName, email, phone, dob, gender, photo: { url, publicId }, userType, createdAt, updatedAt } }` | `"Welcome Back"` | `"All fields Required"` (400), `"Email not registred"` (404), `"Incorrect Password"` (401) |
| Logout | `GET /auth/logout` | Logout user by clearing the auth cookie | None | `{ message: String }` | `"Logout Sucessfully"` | `"Internal Server Error"` (500) |
| Send OTP | `POST /auth/send-otp` | Send a 6-digit OTP to user's email for password reset | `{ email: String }` | `{ message: String }` | `"OTP sent on '<email>'"` | `"Email is required"` (400), `"Email not registered"` (404) |
| Verify OTP | `POST /auth/verify-otp` | Verify the OTP and set a temporary `kitkat` cookie | `{ email: String, otp: String }` | `{ message: String }` | `"OTP verified. Create You New Password Now"` | `"Email is required"` (400), `"OTP Expired"` (401), `"Email not registered"` (404) |
| Reset Password | `POST /auth/reset-password` | Reset user password (requires OTPAuthProtect middleware — `kitkat` cookie) | `{ newPassword: String }` | `{ message: String }` | `"Password Changed"` | `"Session Expired"` (401), `"Internal Server Error"` (500) |

---

## 2. 👤 Common APIs (All Roles)

**Base Path:** `/user`

> These APIs are shared across all authenticated user roles (customer, restaurant, rider, admin). Requires `AuthProtect` middleware (`Oreo` cookie).

| Components | API Endpoints | Description | Request Body | Response Body | Success Message | Error Message |
|---|---|---|---|---|---|---|
| Edit Profile | `PUT /user/edit-profile` | Update user profile (name, phone, photo). Content-Type: `multipart/form-data` | `fullName: String, email: String, phone: String, displayPic: File (optional)` | `{ message: String, data: { _id, fullName, email, phone, dob, gender, photo: { url, publicId }, userType, createdAt, updatedAt } }` | `"User Updated Sucessfully"` | `"All fields Required"` (400), `"Email not registred"` (404), `"Session Expired"` (401) |
| Change Password | `PATCH /user/change-password` | Change user password by verifying old password first | `{ oldPassword: String, newPassword: String }` | `{ message: String }` | `"Password updated successfully"` | `"All fields Required"` (400), `"Old password is incorrect"` (400), `"Session Expired"` (401) |

---

## 3. 🌐 Public APIs

**Base Path:** `/public`

> These APIs are accessible without any authentication.

### ✅ Implemented

| Components | API Endpoints | Description | Request Body | Response Body | Success Message | Error Message |
|---|---|---|---|---|---|---|
| Contact Us | `POST /public/contact-us` | Submit a contact form enquiry | `{ fullName: String, email: String, phone: String, subject: String, message: String }` | `{ message: String }` | `"Thanks for Contacting us! You will hear back from us soon"` | `"All fields Required"` (400) |

### 🔮 Planned (Future Implementation)

| Components | API Endpoints | Description | Request Body | Response Body | Success Message | Error Message |
|---|---|---|---|---|---|---|
| Get All Restaurants | `GET /public/restaurants` | Get a list of all active restaurants for homepage | None | `{ message: String, data: [ { _id, restaurantName, address, city, cuisineTypes, coverImage, averageRating, isOpen, restaurantType, servingHours } ] }` | `"Restaurants fetched successfully"` | `"Internal Server Error"` (500) |
| Get Restaurant By ID | `GET /public/restaurant/:id` | Get detailed info of a single restaurant | None (URL Param: `id`) | `{ message: String, data: { restaurant object with full details } }` | `"Restaurant fetched successfully"` | `"Restaurant not found"` (404) |
| Get Restaurant Menu | `GET /public/restaurant/:id/menu` | Get menu of a specific restaurant | None (URL Param: `id`) | `{ message: String, data: { restaurantId, menuItems: [ { itemName, description, price, category, image, isAvailable } ] } }` | `"Menu fetched successfully"` | `"Restaurant not found"` (404), `"Menu not found"` (404) |
| Search Restaurants | `GET /public/search?q=query` | Search restaurants by name, cuisine, or city | None (Query Param: `q`) | `{ message: String, data: [ { restaurant objects } ] }` | `"Search results fetched"` | `"Internal Server Error"` (500) |

---

## 4. 🍽️ Restaurant APIs

**Base Path:** `/restaurant`

> These APIs are for users with `userType: "restaurant"`. Requires `RestaurantAuthProtect` middleware (verifies `Oreo` cookie + checks `userType === "restaurant"`).

### ✅ Implemented

| Components | API Endpoints | Description | Request Body | Response Body | Success Message | Error Message |
|---|---|---|---|---|---|---|
| Get Restaurant Data | `GET /restaurant/get-restaurant-data?id=managerId` | Fetch restaurant profile data by manager ID | None (Query Param: `id` — Manager's User ID) | `{ success: Boolean, message: String, data: { managerId, restaurantName, address, city, state, pinCode, country, geoLocation, documents, financialDetails, contactDetails, servingHours, isOpen, status, averageRating, cuisineTypes, restaurantImage, coverImage, description, restaurantType, socialMediaLinks } }` | `"Restaurant fetched successfully."` | `"Manager id is required."` (400), `"Restaurant not found."` (404), `"Internal Server Error"` (500), `"Session Expired"` (401), `"Unauthorized Access"` (403) |
| Update Restaurant Profile | `PUT /restaurant/update-profile` | Create or update restaurant profile. Content-Type: `multipart/form-data` | `restaurantName: String, description: String, restaurantType: "veg"\|"non-veg"\|"jain"\|"vegan"\|"both", address: String, city: String, state: String, pinCode: String, country: String, latitude: String, longitude: String, legalName: String, companyType: String, gstCertificate: String, fssaiCertificate: String, panCard: String, bankName: String, accountNumber: String, ifscCode: String, email: String, phone: String, openingTime: String, closingTime: String, cuisineTypes: String (comma-separated), isOpen: Boolean, socialMediaLinks: JSON String [ { platform, url } ], coverImage: File (single), restaurantImage: File (multiple, max 10)` | `{ message: String, data: { full restaurant object } }` | `"Restaurant profile created successfully"` (201) / `"Restaurant profile updated successfully"` (200) | `"Cover image is required"` (400), `"At least one restaurant image is required"` (400), `"Session Expired"` (401), `"Unauthorized Access"` (403) |

### 🔮 Planned (Future Implementation)

| Components | API Endpoints | Description | Request Body | Response Body | Success Message | Error Message |
|---|---|---|---|---|---|---|
| Add Menu Item | `POST /restaurant/menu/add-item` | Add a new item to the restaurant menu | `{ itemName: String, description: String, price: Number, category: String, image: File, isAvailable: Boolean }` | `{ message: String, data: { menuItem } }` | `"Menu item added successfully"` | `"All fields Required"` (400), `"Session Expired"` (401), `"Unauthorized Access"` (403) |
| Update Menu Item | `PUT /restaurant/menu/update-item/:itemId` | Update an existing menu item | `{ itemName: String, description: String, price: Number, category: String, image: File, isAvailable: Boolean }` | `{ message: String, data: { menuItem } }` | `"Menu item updated successfully"` | `"Item not found"` (404), `"Session Expired"` (401) |
| Delete Menu Item | `DELETE /restaurant/menu/delete-item/:itemId` | Delete a menu item | None (URL Param: `itemId`) | `{ message: String }` | `"Menu item deleted successfully"` | `"Item not found"` (404), `"Session Expired"` (401) |
| Get All Menu Items | `GET /restaurant/menu/get-all` | Get all menu items of the restaurant | None | `{ message: String, data: { menuItems: [...] } }` | `"Menu items fetched successfully"` | `"Session Expired"` (401), `"Unauthorized Access"` (403) |
| Toggle Menu Item Availability | `PATCH /restaurant/menu/toggle/:itemId` | Toggle isAvailable for a menu item | None (URL Param: `itemId`) | `{ message: String, data: { menuItem } }` | `"Item availability updated"` | `"Item not found"` (404) |
| Get Restaurant Orders | `GET /restaurant/orders` | Get all orders placed at the restaurant | None (Optional Query: `status`, `page`, `limit`) | `{ message: String, data: [ { order objects } ], total: Number }` | `"Orders fetched successfully"` | `"Session Expired"` (401), `"Unauthorized Access"` (403) |
| Update Order Status | `PATCH /restaurant/orders/:orderId/status` | Accept, reject, or update order status | `{ orderStatus: "accepted"\|"preparing"\|"ready"\|"rejected" }` | `{ message: String, data: { order } }` | `"Order status updated successfully"` | `"Order not found"` (404), `"Invalid status"` (400) |
| Toggle Restaurant Open/Close | `PATCH /restaurant/toggle-status` | Toggle the restaurant open/close status | None | `{ message: String, data: { isOpen: Boolean } }` | `"Restaurant is now open/closed"` | `"Session Expired"` (401), `"Unauthorized Access"` (403) |
| Get Restaurant Dashboard Stats | `GET /restaurant/dashboard` | Get dashboard analytics (total orders, revenue, ratings) | None | `{ message: String, data: { totalOrders, totalRevenue, averageRating, pendingOrders } }` | `"Dashboard data fetched"` | `"Session Expired"` (401) |

---

## 5. 🧑‍💻 Customer APIs

**Base Path:** `/customer`

> These APIs are for users with `userType: "customer"`. Requires `AuthProtect` middleware + customer role check.

### 🔮 Planned (Future Implementation)

| Components | API Endpoints | Description | Request Body | Response Body | Success Message | Error Message |
|---|---|---|---|---|---|---|
| Add Address | `POST /customer/address/add` | Add a new delivery address to address book | `{ name: String, address: String, city: String, state: String, pinCode: String, country: String, addressType: "home"\|"work"\|"other", isDefault: Boolean, geoLocation: { lat: String, lon: String } }` | `{ message: String, data: { addressBook: [...] } }` | `"Address added successfully"` | `"All fields Required"` (400), `"Session Expired"` (401) |
| Update Address | `PUT /customer/address/update/:addressId` | Update an existing address | `{ name: String, address: String, city: String, state: String, pinCode: String, country: String, addressType: "home"\|"work"\|"other", isDefault: Boolean, geoLocation: { lat, lon } }` | `{ message: String, data: { addressBook: [...] } }` | `"Address updated successfully"` | `"Address not found"` (404), `"Session Expired"` (401) |
| Delete Address | `DELETE /customer/address/delete/:addressId` | Delete an address from address book | None (URL Param: `addressId`) | `{ message: String }` | `"Address deleted successfully"` | `"Address not found"` (404), `"Session Expired"` (401) |
| Get All Addresses | `GET /customer/address/get-all` | Get all saved delivery addresses | None | `{ message: String, data: { addressBook: [...] } }` | `"Addresses fetched successfully"` | `"Session Expired"` (401) |
| Set Default Address | `PATCH /customer/address/set-default/:addressId` | Set an address as default | None (URL Param: `addressId`) | `{ message: String, data: { addressBook: [...] } }` | `"Default address updated"` | `"Address not found"` (404) |
| Place Order | `POST /customer/order/place` | Place a new food order | `{ restaurantId: ObjectId, orderItems: [ { itemId: ObjectId, quantity: Number } ], deliveryAddress: { name, address, city, state, pinCode, country, geoLocation: { lat, lon } }, paymentDetails: { paymentMethod: "card"\|"upi" } }` | `{ message: String, data: { order object } }` | `"Order placed successfully"` | `"All fields Required"` (400), `"Restaurant not found"` (404), `"Session Expired"` (401) |
| Get My Orders | `GET /customer/orders` | Get all orders placed by the customer | None (Optional Query: `status`, `page`, `limit`) | `{ message: String, data: [ { order objects with restaurant & rider details } ], total: Number }` | `"Orders fetched successfully"` | `"Session Expired"` (401) |
| Get Order Details | `GET /customer/order/:orderId` | Get details of a specific order | None (URL Param: `orderId`) | `{ message: String, data: { order with populated restaurant, rider, menuItems } }` | `"Order fetched successfully"` | `"Order not found"` (404), `"Session Expired"` (401) |
| Cancel Order | `PATCH /customer/order/:orderId/cancel` | Cancel a pending order | None (URL Param: `orderId`) | `{ message: String, data: { order } }` | `"Order cancelled successfully"` | `"Order not found"` (404), `"Order cannot be cancelled"` (400) |
| Rate Order | `POST /customer/order/:orderId/rate` | Rate a delivered order (1-5) | `{ rating: Number (1-5) }` | `{ message: String, data: { order } }` | `"Rating submitted successfully"` | `"Order not found"` (404), `"Order not delivered yet"` (400), `"Invalid rating"` (400) |
| Track Order | `GET /customer/order/:orderId/track` | Get live tracking info of an active order | None (URL Param: `orderId`) | `{ message: String, data: { orderStatus, riderLocation: { lat, lon }, estimatedTime } }` | `"Tracking data fetched"` | `"Order not found"` (404) |

---

## 6. 🛡️ Admin APIs

**Base Path:** `/admin`

> These APIs are for users with `userType: "admin"`. Requires `AuthProtect` middleware + admin role check.

### 🔮 Planned (Future Implementation)

| Components | API Endpoints | Description | Request Body | Response Body | Success Message | Error Message |
|---|---|---|---|---|---|---|
| Get All Users | `GET /admin/users` | Get all registered users with filters | None (Optional Query: `userType`, `page`, `limit`, `search`) | `{ message: String, data: [ { user objects } ], total: Number }` | `"Users fetched successfully"` | `"Session Expired"` (401), `"Unauthorized Access"` (403) |
| Get User By ID | `GET /admin/users/:userId` | Get detailed info of a specific user | None (URL Param: `userId`) | `{ message: String, data: { user object } }` | `"User fetched successfully"` | `"User not found"` (404), `"Unauthorized Access"` (403) |
| Block/Unblock User | `PATCH /admin/users/:userId/block` | Block or unblock a user | `{ isBlocked: Boolean }` | `{ message: String, data: { user } }` | `"User blocked/unblocked successfully"` | `"User not found"` (404), `"Unauthorized Access"` (403) |
| Get All Restaurants | `GET /admin/restaurants` | Get all restaurants with status filters | None (Optional Query: `status: "active"\|"inactive"\|"blocked"`, `page`, `limit`) | `{ message: String, data: [ { restaurant objects } ], total: Number }` | `"Restaurants fetched successfully"` | `"Session Expired"` (401), `"Unauthorized Access"` (403) |
| Approve/Reject Restaurant | `PATCH /admin/restaurants/:restaurantId/status` | Change restaurant status (activate, deactivate, block) | `{ status: "active"\|"inactive"\|"blocked" }` | `{ message: String, data: { restaurant } }` | `"Restaurant status updated"` | `"Restaurant not found"` (404), `"Unauthorized Access"` (403) |
| Get All Riders | `GET /admin/riders` | Get all riders with status filters | None (Optional Query: `status`, `page`, `limit`) | `{ message: String, data: [ { rider objects } ], total: Number }` | `"Riders fetched successfully"` | `"Session Expired"` (401), `"Unauthorized Access"` (403) |
| Approve/Reject Rider | `PATCH /admin/riders/:riderId/status` | Change rider status (activate, deactivate, block) | `{ status: "active"\|"inactive"\|"blocked" }` | `{ message: String, data: { rider } }` | `"Rider status updated"` | `"Rider not found"` (404), `"Unauthorized Access"` (403) |
| Get All Orders | `GET /admin/orders` | Get all platform orders | None (Optional Query: `orderStatus`, `restaurantId`, `page`, `limit`, `startDate`, `endDate`) | `{ message: String, data: [ { order objects } ], total: Number }` | `"Orders fetched successfully"` | `"Session Expired"` (401), `"Unauthorized Access"` (403) |
| Get Dashboard Stats | `GET /admin/dashboard` | Get platform-wide analytics | None | `{ message: String, data: { totalUsers, totalRestaurants, totalRiders, totalOrders, totalRevenue, activeOrders, pendingApprovals } }` | `"Dashboard stats fetched"` | `"Session Expired"` (401), `"Unauthorized Access"` (403) |
| Get All Contact Messages | `GET /admin/contacts` | Get all contact form submissions | None (Optional Query: `page`, `limit`) | `{ message: String, data: [ { fullName, email, phone, subject, message, createdAt } ], total: Number }` | `"Contacts fetched successfully"` | `"Session Expired"` (401), `"Unauthorized Access"` (403) |
| Delete Contact Message | `DELETE /admin/contacts/:contactId` | Delete a contact form submission | None (URL Param: `contactId`) | `{ message: String }` | `"Contact deleted successfully"` | `"Contact not found"` (404), `"Unauthorized Access"` (403) |

---

## 7. 🏍️ Rider APIs

**Base Path:** `/rider`

> These APIs are for users with `userType: "rider"`. Requires `AuthProtect` middleware + rider role check.

### 🔮 Planned (Future Implementation)

| Components | API Endpoints | Description | Request Body | Response Body | Success Message | Error Message |
|---|---|---|---|---|---|---|
| Create/Update Rider Profile | `PUT /rider/update-profile` | Create or update rider profile with vehicle & documents | `{ vehicleDetails: { vehicleType: String, vehicleNumber: String, vehicleModel: String, vehicleColor: String }, documents: { drivingLicense: String, vehicleRegistrationCertificate: String, insuranceCertificate: String, aadharCard: String, panCard: String }, currentAddress: { address: String, city: String, state: String, pinCode: String, country: String }, financialDetails: { bankName: String, accountNumber: String, ifscCode: String } }` | `{ message: String, data: { rider object } }` | `"Rider profile created/updated successfully"` | `"All fields Required"` (400), `"Session Expired"` (401), `"Unauthorized Access"` (403) |
| Get Rider Profile | `GET /rider/profile` | Get rider's full profile data | None | `{ message: String, data: { riderId, vehicleDetails, documents, currentAddress, status, averageRating, isAvailable, financialDetails, currentLocation } }` | `"Rider profile fetched successfully"` | `"Rider profile not found"` (404), `"Session Expired"` (401) |
| Toggle Availability | `PATCH /rider/toggle-availability` | Toggle rider's online/offline status | None | `{ message: String, data: { isAvailable: Boolean } }` | `"You are now online/offline"` | `"Session Expired"` (401), `"Unauthorized Access"` (403) |
| Update Location | `PATCH /rider/update-location` | Update rider's current GPS location | `{ lat: String, lon: String }` | `{ message: String }` | `"Location updated"` | `"Invalid coordinates"` (400), `"Session Expired"` (401) |
| Get Available Orders | `GET /rider/orders/available` | Get orders ready for pickup near rider | None (Optional Query: `lat`, `lon`, `radius`) | `{ message: String, data: [ { order objects with restaurant details } ] }` | `"Available orders fetched"` | `"Session Expired"` (401), `"Unauthorized Access"` (403) |
| Accept Order | `PATCH /rider/orders/:orderId/accept` | Accept an order for delivery | None (URL Param: `orderId`) | `{ message: String, data: { order } }` | `"Order accepted successfully"` | `"Order not found"` (404), `"Order already taken"` (409), `"Session Expired"` (401) |
| Update Delivery Status | `PATCH /rider/orders/:orderId/status` | Update the delivery status of an order | `{ orderStatus: "pickedUp"\|"onTheWay"\|"outForDelivery"\|"delivered"\|"undeliverable" }` | `{ message: String, data: { order } }` | `"Delivery status updated"` | `"Order not found"` (404), `"Invalid status transition"` (400), `"Session Expired"` (401) |
| Get My Deliveries | `GET /rider/deliveries` | Get all past and current deliveries | None (Optional Query: `status`, `page`, `limit`) | `{ message: String, data: [ { order objects } ], total: Number }` | `"Deliveries fetched successfully"` | `"Session Expired"` (401), `"Unauthorized Access"` (403) |
| Get Rider Dashboard Stats | `GET /rider/dashboard` | Get rider earnings and delivery stats | None | `{ message: String, data: { totalDeliveries, todayDeliveries, totalEarnings, todayEarnings, averageRating } }` | `"Dashboard data fetched"` | `"Session Expired"` (401), `"Unauthorized Access"` (403) |

---

## 📋 Data Models Reference

### User Model
```json
{
  "_id": "ObjectId",
  "fullName": "String",
  "email": "String (unique)",
  "phone": "String",
  "dob": "Date",
  "gender": "String",
  "password": "String (hashed)",
  "photo": { "url": "String", "publicId": "String" },
  "userType": "admin | customer | rider | restaurant",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Restaurant Model
```json
{
  "_id": "ObjectId",
  "managerId": "ObjectId (ref: user)",
  "restaurantName": "String",
  "address": "String",
  "city": "String",
  "state": "String",
  "pinCode": "String",
  "country": "String",
  "geoLocation": { "lat": "String", "lon": "String" },
  "documents": {
    "legalName": "String",
    "companyType": "String",
    "gstCertificate": "String",
    "fssaiCertificate": "String",
    "panCard": "String"
  },
  "financialDetails": {
    "bankName": "String",
    "accountNumber": "String",
    "ifscCode": "String"
  },
  "contactDetails": { "email": "String", "phone": "String" },
  "servingHours": { "openingTime": "String", "closingTime": "String" },
  "isOpen": "Boolean",
  "status": "active | inactive | blocked",
  "averageRating": "Number",
  "cuisineTypes": ["String"],
  "restaurantImage": [{ "url": "String", "publicId": "String" }],
  "coverImage": { "url": "String", "publicId": "String" },
  "description": "String",
  "restaurantType": "veg | non-veg | jain | vegan | both",
  "socialMediaLinks": [{ "platform": "String", "url": "String" }]
}
```

### Customer Model
```json
{
  "_id": "ObjectId",
  "customerId": "ObjectId (ref: user)",
  "addressBook": [{
    "name": "String",
    "address": "String",
    "city": "String",
    "state": "String",
    "pinCode": "String",
    "country": "String",
    "addressType": "home | work | other",
    "isDefault": "Boolean",
    "geoLocation": { "lat": "String", "lon": "String" }
  }],
  "isActive": "Boolean",
  "status": "pending | verified | suspended"
}
```

### Rider Model
```json
{
  "_id": "ObjectId",
  "riderId": "ObjectId (ref: user)",
  "vehicleDetails": {
    "vehicleType": "String",
    "vehicleNumber": "String",
    "vehicleModel": "String",
    "vehicleColor": "String"
  },
  "documents": {
    "drivingLicense": "String",
    "vehicleRegistrationCertificate": "String",
    "insuranceCertificate": "String",
    "aadharCard": "String",
    "panCard": "String"
  },
  "currentAddress": {
    "address": "String",
    "city": "String",
    "state": "String",
    "pinCode": "String",
    "country": "String"
  },
  "status": "active | inactive | blocked",
  "averageRating": "Number",
  "isAvailable": "Boolean",
  "financialDetails": {
    "bankName": "String",
    "accountNumber": "String",
    "ifscCode": "String"
  },
  "currentLocation": { "lat": "String", "lon": "String" }
}
```

### Order Model
```json
{
  "_id": "ObjectId",
  "restaurantId": "ObjectId (ref: restaurant)",
  "customerId": "ObjectId (ref: customer)",
  "riderId": "ObjectId (ref: rider, optional)",
  "orderItems": [{
    "itemId": "ObjectId (ref: menuItem)",
    "quantity": "Number"
  }],
  "orderStatus": "pending | accepted | preparing | ready | pickedUp | onTheWay | outForDelivery | undeliverable | delivered | cancelled | failed | rejected",
  "rating": "Number (1-5)",
  "billDetails": {
    "totalAmount": "Number",
    "platformFee": "Number",
    "convenienceFee": "Number",
    "taxAmount": "Number",
    "deliveryCharge": "Number",
    "discountAmount": "Number",
    "finalAmount": "Number"
  },
  "deliveryAddress": {
    "name": "String",
    "address": "String",
    "city": "String",
    "state": "String",
    "pinCode": "String",
    "country": "String",
    "geoLocation": { "lat": "String", "lon": "String" }
  },
  "paymentDetails": {
    "paymentMethod": "card | upi",
    "paymentStatus": "pending | completed | failed"
  }
}
```

### Menu Model
```json
{
  "_id": "ObjectId",
  "restaurantId": "ObjectId (ref: restaurant)",
  "menuItems": [{
    "itemName": "String",
    "description": "String",
    "price": "Number",
    "category": "String",
    "image": { "url": "String", "publicId": "String" },
    "isAvailable": "Boolean",
    "isTopRated": "Boolean",
    "isRecommended": "Boolean",
    "isNew": "Boolean"
  }]
}
```

### Contact Model
```json
{
  "_id": "ObjectId",
  "fullName": "String",
  "email": "String",
  "phone": "String",
  "subject": "String",
  "message": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### OTP Model
```json
{
  "_id": "ObjectId",
  "email": "String (unique)",
  "otp": "String (hashed)",
  "expiresAt": "Date (5 min from creation)"
}
```

---

## 🔒 Middleware Reference

| Middleware | Cookie | Description |
|---|---|---|
| `AuthProtect` | `Oreo` | Verifies JWT token from `Oreo` cookie. Attaches `req.user` with full user object. Used by Common, Customer, Admin, and Rider routes. |
| `OTPAuthProtect` | `kitkat` | Verifies JWT token from `kitkat` cookie (set after OTP verification). Used only for `reset-password` route. |
| `RestaurantAuthProtect` | `Oreo` | Verifies JWT token + checks `userType === "restaurant"`. Returns 403 if not a restaurant user. Used by Restaurant routes. |

---

## ⚠️ Common Error Response Format

All errors follow this consistent format:

```json
{
  "message": "Error description here"
}
```

| Status Code | Meaning |
|---|---|
| `400` | Bad Request — Missing or invalid fields |
| `401` | Unauthorized — Session expired / invalid token |
| `403` | Forbidden — User role not authorized |
| `404` | Not Found — Resource doesn't exist |
| `409` | Conflict — Duplicate resource (e.g., email) |
| `500` | Internal Server Error |

---

> **Legend:**
> - ✅ **Implemented** — API is coded and working in the current codebase
> - 🔮 **Planned** — API is designed based on existing models and will be implemented in future
