import React from "react";


export default function FriendsListLoading() {
    const loadingList = [];

    for (let i = 0; i < 14; i++) {
        loadingList.push(
            <div className="animate-pulse flex space-x-4 py-2 border-t px-2" key={i}>
                <div className="rounded-full bg-gray-300 h-8 w-8"></div>
                <div className="flex-1 space-y-2 py-1">
                    <div className="h-2 w-1/2 bg-gray-300 rounded"></div>
                    <div className="">
                        
                        <div className="h-2 w-1/5 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }
    return <div>{loadingList}</div>;
}
