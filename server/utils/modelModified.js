const User = require("../models/userModel");

const updateUser = async () => {
  try {
    await User.updateMany(
      {
        emailVerified: { $exists: false },
      },
      {
        $set: { emailVerified: false },
      }
    );
    console.log("User Updated");
  } catch (error) {
    console.log(error);
  }
};

module.exports = updateUser;
