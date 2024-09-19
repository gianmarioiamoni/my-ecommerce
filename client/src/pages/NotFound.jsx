// Create Not Found page
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * The NotFound component is a simple page that is displayed when the user attempts to
 * access a route that does not exist.
 *
 * The component renders a heading and a link back to the homepage.
 *
 * @returns {ReactElement} The NotFound page
 */
const NotFound = () => {
    return (
        <div>
            <h1>Page Not Found</h1>

            {/* Link back to the homepage */}
            <Link to="/">Go Home</Link>
        </div>
    );
};

export default NotFound;