'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserHeader = ({ user }) => {
    if (!user) return null;

    return (
        <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${user.fullName}&background=0D8ABC&color=fff`} alt={user.fullName} />
                <AvatarFallback>{user.fullName?.[0]}</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-3xl font-bold text-white font-headline">{user.fullName}</h1>
                <p className="text-md text-gray-400">{user.email}</p>
            </div>
        </div>
    );
};

export default UserHeader;
