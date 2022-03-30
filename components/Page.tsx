import React from "react";
import { MyComponent } from "../utils/types";
import Head from "next/head";
import createClassName from "../src/hooks/createClassName";

interface IPage {
    title: string
    safeMissClick?: boolean
}

const Page: React.FC<IPage & MyComponent> = props=> {
    const className = createClassName(["page", props.className]);
    
    return <>
        <Head>
            <title>{ props.title } - Pixel share!</title>
        </Head>
        <main onContextMenu={ e=> props.safeMissClick && e.preventDefault() } className={ className } style={ props.style }>
            { props.children }
        </main>
    </>;
};

export default Page;