import React from 'react';
import { IconButton, Menu, MenuItem as DropdownItem, Divider } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';

/**
 * The AddToWishlistButton component is used to add a product to a wishlist.
 * It's a button that opens a menu with the user's wishlists.
 * If the product is already in the wishlist, it will show a FavoriteIcon.
 * If not, it will show a FavoriteBorderIcon.
 * The component also takes the product, isInWishlist, handleWishlistMenuOpen,
 * handleWishlistMenuClose, anchorEl, handleWishlistSelection, and wishlists
 * as props.
 * The component will return a fragment with the button and the menu.
 * @param {Object} props - The props object.
 * @param {Object} props.product - The product object.
 * @param {Boolean} props.isInWishlist - Whether the product is in the wishlist.
 * @param {Function} props.handleWishlistMenuOpen - The function to open the menu.
 * @param {Function} props.handleWishlistMenuClose - The function to close the menu.
 * @param {Object} props.anchorEl - The element that the menu is anchored to.
 * @param {Function} props.handleWishlistSelection - The function to handle the wishlist selection.
 * @param {Array} props.wishlists - The array of wishlists.
 * @returns {JSX.Element} - The component.
 */
const AddToWishlistButton = ({
    product,
    isInWishlist,
    handleWishlistMenuOpen,
    handleWishlistMenuClose,
    anchorEl,
    handleWishlistSelection,
    wishlists,
}) => {
    const { t } = useTranslation(); 

    return (
        <>
            <IconButton
                size="small"
                color="primary"
                onClick={(event) => handleWishlistMenuOpen(event, product)}
            >
                {/* If the product is in the wishlist, show a FavoriteIcon */}
                {/* Otherwise, show a FavoriteBorderIcon */}
                {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleWishlistMenuClose}
            >
                <DropdownItem onClick={() => handleWishlistSelection('create-new')}>
                    {/* Show a AddIcon and the text "Create new wishlist" */}
                    <AddIcon fontSize="small" sx={{ marginRight: 1 }} />
                    {t('wishlist.createNew')} 
                </DropdownItem>
                <Divider />
                {wishlists.map((wishlist) => (
                    <DropdownItem key={wishlist._id} onClick={() => handleWishlistSelection(wishlist._id)}>
                        {/* Show the name of the wishlist */}
                        {wishlist.name}
                    </DropdownItem>
                ))}
            </Menu>
        </>
    );
};

export default AddToWishlistButton;

