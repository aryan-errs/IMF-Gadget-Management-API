import express from 'express';
import * as GadgetController from '../controllers/gadgets.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/',
  authenticateToken,
  authorizeRoles(['AGENT', 'HANDLER', 'DIRECTOR']),
  GadgetController.getAllGadgets
);

router.post('/',
  authenticateToken,
  authorizeRoles(['HANDLER', 'DIRECTOR']),
  GadgetController.createGadget
);

router.patch('/:id',
  authenticateToken,
  authorizeRoles(['HANDLER', 'DIRECTOR']),
  GadgetController.updateGadget
);

router.delete('/:id',
  authenticateToken,
  authorizeRoles(['DIRECTOR']),
  GadgetController.decommissionGadget
);

router.post('/:id/self-destruct',
  authenticateToken,
  authorizeRoles(['DIRECTOR']),
  GadgetController.selfDestruct
);

export default router;
