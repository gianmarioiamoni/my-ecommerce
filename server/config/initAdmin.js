// initAdmin.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const createAdminUser = async () => {
    const existingAdmin = await User.findOne({ isAdmin: true });

    if (!existingAdmin) {
        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
        const adminPassword = process.env.DEFAULT_ADMIN_PWD;
        const hashedPassword = await bcrypt.hash(adminPassword, 12);

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
