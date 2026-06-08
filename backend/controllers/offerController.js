import Offer from '../models/Offer.js';

// @desc    Get all offers
// @route   GET /api/offers
// @access  Public
export const getAllOffers = async (req, res, next) => {
  const { activeOnly } = req.query;
  const filter = {};

  if (activeOnly === 'true') {
    filter.isActive = true;
    filter.expiresAt = { $gt: Date.now() };
  }

  try {
    const offers = await Offer.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: offers.length, offers });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new offer
// @route   POST /api/offers
// @access  Private/Admin
export const createOffer = async (req, res, next) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json({ success: true, message: 'Offer created successfully', offer });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an offer
// @route   PUT /api/offers/:id
// @access  Private/Admin
export const updateOffer = async (req, res, next) => {
  const { id } = req.params;

  try {
    const offer = await Offer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    res.status(200).json({ success: true, message: 'Offer updated successfully', offer });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
export const deleteOffer = async (req, res, next) => {
  const { id } = req.params;

  try {
    const offer = await Offer.findByIdAndDelete(id);

    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    res.status(200).json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    next(error);
  }
};
