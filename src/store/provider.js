"use client";


import { Provider, useDispatch } from "react-redux";
import { store } from "./store";

export function Providers({children}){

    return <Provider store={store}>
        {children}
    </Provider>
}