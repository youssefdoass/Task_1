import Joi from 'joi';
import { Perk } from '../models/Perk.js';

// validation schema for creating/updating a perk
const perkSchema = Joi.object({
  // check that title is at least 2 characters long, and required
  title: Joi.string().min(2).required(),
  // description is optional
  description: Joi.string().allow(''),
  // category must be one of the defined values, default to 'other'
  category: Joi.string().valid('food','tech','travel','fitness','other').default('other'),
  // discountPercent must be between 0 and 100, default to 0
  discountPercent: Joi.number().min(0).max(100).default(0),
  // merchant is optional
  merchant: Joi.string().allow('')

}); 

  

// Filter perks by exact title match if title query parameter is provided 
export async function filterPerks(req, res, next) {
  try {
    const { title } = req.query     ;
    if (title) {
      const perks = await Perk.find ({ title: title}).sort({ createdAt: -1 });
      console.log(perks);
      res.status(200).json(perks)
    }
    else {
      res.status(400).json({ message: 'Title query parameter is required' });
    }
  } catch (err) { next(err); }
}


// Get a single perk by ID 
export async function getPerk(req, res, next) {
  try {
    const perk = await Perk.findById(req.params.id);
    console.log(perk);
    if (!perk) return res.status(404).json({ message: 'Perk not found' });
    res.json({ perk });
    // next() is used to pass errors to the error handling middleware
  } catch (err) { next(err); }
}

// get all perks
export async function getAllPerks(req, res, next) {
  try {
    const perks = await Perk.find().sort({ createdAt: -1 });
    res.json(perks);
  } catch (err) { next(err); }
}

// Create a new perk
export async function createPerk(req, res, next) {
  try {
    // validate request body against schema
    const { value, error } = perkSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
     // ...value spreads the validated fields
    const doc = await Perk.create({ ...value});
    res.status(201).json({ perk: doc });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Duplicate perk for this merchant' });
    next(err);
  }
}
// Update an existing perk by ID and validate only the fields that are being updated 
export async function updatePerk(req, res, next) {
  try {
    // First find the existing perk
    const perk = await Perk.findById(req.params.id);
    if (!perk) {
      return res.status(404).json({ message: 'Perk not found' });
    }

    // Create a validation schema only for the fields being updated
    const updateValidation = {};
    if (req.body.title !== undefined) updateValidation.title = Joi.string().min(2);
    if (req.body.description !== undefined) updateValidation.description = Joi.string().allow('');
    if (req.body.category !== undefined) updateValidation.category = Joi.string().valid('food','tech','travel','fitness','other');
    if (req.body.discountPercent !== undefined) updateValidation.discountPercent = Joi.number().min(0).max(100);
    if (req.body.merchant !== undefined) updateValidation.merchant = Joi.string().allow('');

    // Validate only the fields being updated
    const updateSchema = Joi.object(updateValidation);
    const { error } = updateSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    // Apply updates to perk document
    if (req.body.title !== undefined) perk.title = req.body.title;
    if (req.body.description !== undefined) perk.description = req.body.description;
    if (req.body.category !== undefined) perk.category = req.body.category;
    if (req.body.discountPercent !== undefined) perk.discountPercent = req.body.discountPercent;
    if (req.body.merchant !== undefined) perk.merchant = req.body.merchant;

    // Save the updated perk
    await perk.save();

    res.json({ perk });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Duplicate perk for this merchant' });
    }
    next(err);
  }
}