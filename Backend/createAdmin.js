const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = "mongodb+srv://palak:test123@sign-upamazonclone.nkglzjw.mongodb.net/BlinkIt?retryWrites=true&w=majority&appName=Sign-upAmazonClone";

(async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    const hashed = await bcrypt.hash("admin123", 10);

    const admin = new User({
      name: "Admin",
      email: "admin@example.com",
      password: hashed,
      address: "HQ",
      role: "admin"
    });

    await admin.save();
    console.log("✅ Admin created successfully!");
    mongoose.disconnect();
  } catch (e) {
    console.error(e);
  }
})();
