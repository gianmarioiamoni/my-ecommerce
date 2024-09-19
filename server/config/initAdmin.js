// initAdmin.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

/**
 * Creates an admin user if no admin user exists.
 */
const createAdminUser = async () => {
    const existingAdmin = await User.findOne({ isAdmin: true });

    if (!existingAdmin) {
        /**
         * The default admin email and password are taken from environment variables.
         * These variables should be set in the .env file.
         */
        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
        const adminPassword = process.env.DEFAULT_ADMIN_PWD;

        // Hash the default admin password with 12 rounds of bcrypt
        const hashedPassword = await bcrypt.hash(adminPassword, 12);

        // Create the admin user
        await User.create({
            name: 'admin',
            email: adminEmail,
            password: hashedPassword,
            isAdmin: true,
        });

        console.log('Admin user created');
    } else {
        console.log('Admin user already exists');
    }
};

export default createAdminUser;
