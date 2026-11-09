import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"스도쿠 노트 제작실",description:"검증된 스도쿠 노트를 만들고 인쇄용 PDF로 저장하세요."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}
