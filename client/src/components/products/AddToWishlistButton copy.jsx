import React from 'react';
import { IconButton, Menu, MenuItem as DropdownItem, Divider } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';


const AddToWishlistButton = ({
    product,
    isInWishlist,
    handleWishlistMenuOpen,
    handleWishlistMenuClose,
    anchorEl,
    handleWishlistSelection,
    wishlists,
}) => {

    return (
        <>
            <IconButton
                size="small"
                color="primary"
                onClick={(event) => handleWishlistMenuOpen(event, product)}
            >
                {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleWishlistMenuClose}
            >
                <DropdownItem onClick={() => handleWishlistSelection('create-new')}>
                    <AddIcon fontSize="small" sx={{ marginRight: 1 }} />
                    Create New Wishlist
                </DropdownItem>
                <Divider />
                {wishlists.map((wishlist) => (
                    <DropdownItem key={wishlist._id} onClick={() => handleWishlistSelection(wishlist._id)}>
                        {wishlist.name}
                    </DropdownItem>
                ))}
            </Menu>
        </>
    );
};

export default AddToWishlistButton;
