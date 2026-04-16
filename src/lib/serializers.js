function sanitizeUser(userDoc) {
  return {
    id: userDoc._id.toString(),
    name: userDoc.name,
    email: userDoc.email,
    avBg: userDoc.avatar?.bg || "",
    avBorder: userDoc.avatar?.border || "",
    avText: userDoc.avatar?.text || "",
    joined: userDoc.createdAt
  };
}

module.exports = {
  sanitizeUser
};
