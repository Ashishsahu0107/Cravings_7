import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const users = [
  // ==================== Managers ====================
  {
    fullName: "Manager 1",
    email: "manager1@gmail.com",
    password: "Manager@123",
    dob: "2000-01-01",
    gender: "other",
    userType: "restaurant",
    phone: "9876543210",
    photo: {
      url: "https://placehold.co/600x400?text=M1",
      publicId: null,
    },
  },
  {
    fullName: "Manager 2",
    email: "manager2@gmail.com",
    password: "Manager@123",
    dob: "2000-01-01",
    gender: "other",
    userType: "restaurant",
    phone: "9876543211",
    photo: {
      url: "https://placehold.co/600x400?text=M2",
      publicId: null,
    },
  },
  {
    fullName: "Manager 3",
    email: "manager3@gmail.com",
    password: "Manager@123",
    dob: "2000-01-01",
    gender: "other",
    userType: "restaurant",
    phone: "9876543212",
    photo: {
      url: "https://placehold.co/600x400?text=M3",
      publicId: null,
    },
  },

  // ==================== Riders ====================
  {
    fullName: "Rider 1",
    email: "rider1@gmail.com",
    password: "Rider@123",
    dob: "2000-01-01",
    gender: "male",
    userType: "rider",
    phone: "9876543220",
    photo: {
      url: "https://placehold.co/600x400?text=R1",
      publicId: null,
    },
  },
  {
    fullName: "Rider 2",
    email: "rider2@gmail.com",
    password: "Rider@123",
    dob: "2000-01-01",
    gender: "male",
    userType: "rider",
    phone: "9876543221",
    photo: {
      url: "https://placehold.co/600x400?text=R2",
      publicId: null,
    },
  },
  {
    fullName: "Rider 3",
    email: "rider3@gmail.com",
    password: "Rider@123",
    dob: "2000-01-01",
    gender: "male",
    userType: "rider",
    phone: "9876543222",
    photo: {
      url: "https://placehold.co/600x400?text=R3",
      publicId: null,
    },
  },

  // ==================== Admins ====================
  {
    fullName: "Admin 1",
    email: "admin1@gmail.com",
    password: "Admin@123",
    dob: "2000-01-01",
    gender: "other",
    userType: "admin",
    phone: "9876543230",
    photo: {
      url: "https://placehold.co/600x400?text=A1",
      publicId: null,
    },
  },
  {
    fullName: "Admin 2",
    email: "admin2@gmail.com",
    password: "Admin@123",
    dob: "2000-01-01",
    gender: "other",
    userType: "admin",
    phone: "9876543231",
    photo: {
      url: "https://placehold.co/600x400?text=A2",
      publicId: null,
    },
  },
  {
    fullName: "Admin 3",
    email: "admin3@gmail.com",
    password: "Admin@123",
    dob: "2000-01-01",
    gender: "other",
    userType: "admin",
    phone: "9876543232",
    photo: {
      url: "https://placehold.co/600x400?text=A3",
      publicId: null,
    },
  },
];

const userSeed = async () => {
  try {
    await Promise.all(
      users.map(async (user) => {
        // Delete existing user
        await User.deleteOne({ email: user.email });

        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Create user
        await User.create({
          ...user,
          password: hashedPassword,
        });

        console.log(`✅ ${user.fullName} created`);
      })
    );

    console.log("🎉 All users seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
};

export default userSeed;