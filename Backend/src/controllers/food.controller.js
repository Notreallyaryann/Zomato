const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const { v4: uuid } = require('uuid');

const createFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Video file is required",
        success: false,
      });
    }

    // Upload video to ImageKit
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());

    // Create food item in DB
    const foodItem = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      video: fileUploadResult.url,
      foodPartner: req.foodPartner._id
    });

    return res.status(201).json({
      message: "Food Item created Successfully",
      success: true,
      food: foodItem,
    });

  } catch (error) {
    console.error("createFood error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
}

module.exports = {
  createFood
};
