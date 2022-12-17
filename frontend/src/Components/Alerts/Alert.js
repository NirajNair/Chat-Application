import React from "react";
import { MdCancel, MdOutlineWarning, MdOutlineCheck } from "react-icons/md";

export default function Alert(props) {
    return (
        <div
            className={`alert alert-${props.type} shadow-lg mx-auto rounded-md text-sm p-4 font-medium w-fit flex justify-between`}
        >
            {props.type === "error" ? (
                <MdCancel size={20} />
            ) : (props.type === "warning" ? (
                <MdOutlineWarning size={20} />
            ) : (
                <MdOutlineCheck size={20} />
            ))}
            {/* { props.type === "error" ? <MdCancel size={20} /> : <MdOutlineCheck size={20} />}  */}
            <span>{props.msg}</span>
        </div>
    );
}
