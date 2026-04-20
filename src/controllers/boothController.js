const boothService = require('../services/boothService');

const getAllBooths = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await boothService.getBoothsWithStampStatus(userId);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
  }
};

module.exports = { getAllBooths };