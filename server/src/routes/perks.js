import { Router } from 'express';
import { filterPerks, getPerk, createPerk, updatePerk, getAllPerks} from '../controllers/perkController.js';

const router = Router();

router.get('/', filterPerks);
router.get('/all', getAllPerks);
router.get('/:id', getPerk);
router.post('/', createPerk);
// put vs patch: put is for full updates, patch is for partial updates. they will both work,However it is just a convention.
router.patch('/:id', updatePerk);
// Delete route removed until deletePerk controller is implemented

export default router;
