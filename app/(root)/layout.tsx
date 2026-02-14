import { Header } from "@/components/layouts/header";
import { LayoutType } from "@/types";

const Layout = ({ children }: LayoutType) => {
	return <>
	<Header/>
	{children}
	</>;
};

export default Layout;
