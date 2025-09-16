const foodPartnerModel = require('../models/foodpartner.model');
const userModel = require("../models/user.model");
const jwt = require('jsonwebtoken');

const authFoodPartnerMiddleware = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorised Access",
      success: false
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const partnerId = decoded._id || decoded.id;

    const foodPartner = await foodPartnerModel.findById(partnerId);

    if (!foodPartner) {
      return res.status(401).json({
        message: "Invalid Token - Partner not found",
        success: false,
      });
    }

    req.foodPartner = foodPartner;
    next();
  } catch (error) {

    return res.status(401).json({
      message: "Invalid Token",
      success: false,
    });
  }
};


const authUserMiddleware = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Please login first",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded._id || decoded.id;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(401).json({
        message: "Invalid Token - User not found",
        success: false,
      });
    }

    req.user = user;
    next();
  } catch (error) {

    return res.status(401).json({
      message: "Invalid Token",
      success: false,
    });
  }
};

module.exports = {
  authFoodPartnerMiddleware,
  authUserMiddleware
};

