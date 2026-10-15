import express from 'express';
import { 
    addToWishlist, 
    getWishlist, 
    removeFromWishlist 
} from '../controllers/wishlist.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(isAuthenticated);

router.get('/', getWishlist);
router.post('/:productId', addToWishlist);
router.delete('/:productId', removeFromWishlist);

export default router;