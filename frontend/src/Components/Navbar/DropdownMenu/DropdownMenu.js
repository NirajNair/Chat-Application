import React, { useState } from "react";
import { GiTigerHead } from "react-icons/gi";
import { CgProfile, CgChevronDown, CgMenu } from "react-icons/cg";


export default function DropdownMenu() {

    return (
        <div className="absolute right-0">
            <ul>
                <li>Profile</li>
                <li>Logout</li>
            </ul>
        </div>
    );
}
