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
const getBoothById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const boothId = parseInt(id);
    if (isNaN(boothId)) {
      return res.status(400).json({ message: "INVALID_BOOTH_ID" });
    }

    const result = await boothService.getBoothDetail(boothId, userId);

    if (!result) {
      return res.status(404).json({ message: "BOOTH_NOT_FOUND" });
    }
    return res.status(200).json(result);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
  }
};

module.exports = { getAllBooths, getBoothById };