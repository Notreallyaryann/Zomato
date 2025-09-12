const foodPartnerModel = require('../models/foodpartner.model');
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

   
    const foodPartner = await foodPartnerModel.findById(decoded._id);

    if (!foodPartner) {
      return res.status(401).json({
        message: "Invalid Token",
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

module.exports = {
  authFoodPartnerMiddleware
};
