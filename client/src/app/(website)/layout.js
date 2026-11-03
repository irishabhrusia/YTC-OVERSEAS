import React, { Suspense } from "react";
import Footer from "../component/common/Footer";
import Header from "../component/common/Header";
import ScrollToTop from "../component/common/ScrollToTop";

export default function WebsiteLayout({children}) {
    return (
        <>
         <Suspense fallback={<div className="h-20 md:h-24 bg-white border-b border-slate-100" />}>
           <Header/>
         </Suspense>
         <main className="flex-1">{children}</main>
         <Footer/>
         <ScrollToTop />
        </>
    )
}
