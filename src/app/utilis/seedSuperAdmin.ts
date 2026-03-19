import { envVars } from "../config/env";
import { IsAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model"
import bcryptjs from "bcryptjs";


export const seedSuperAdmin = async () => {
try {
    const isSuperAdminExist = await User.findOne({email : envVars.SUPER_ADMIN_EMAIL});

    if(isSuperAdminExist){
        // console.log('Super Admin already exists');
        return;
    }

    const hashedPassword =await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD,Number(envVars.BCRYPT_SALT_ROUND));

    const authProvider : IsAuthProvider = {
        provider : "credentials",
        providerID : envVars.SUPER_ADMIN_EMAIL
    }

    const payload : IUser = {
        name : "Super Admin",
        role : Role.SUPER_ADMIN,
        email : envVars.SUPER_ADMIN_EMAIL,
        auths : [authProvider],
        isVerified: true,
        password : hashedPassword 
    }

    const superAdmin =await User.create(payload);
    console.log(superAdmin);


} catch (err) {
    console.log(err)
    
}
}