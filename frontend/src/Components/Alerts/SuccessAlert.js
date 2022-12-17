import { PromiseProvider } from "mongoose";
import React from "react";
import { MdOutlineCheck } from "react-icons/md";

export default function SuccessAlert() {
    return (
        <div className="alert alert-success shadow-lg relative mx-auto rounded-md text-sm p-4 w-fit flex justify-between">
            <MdOutlineCheck size={20} />
            <span>User Added!</span>
        </div>
    );
}
