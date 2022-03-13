import React from "react";
import { MyComponent } from "../utils/types";
import Head from "next/head";
import createClassName from "../src/hooks/createClassName";

interface IPage {
    title: string
}

const Page: React.FC<IPage & MyComponent> = props=> {
    const className = createClassName(["page", props.className]);
    
    return <>
        <Head>
            <title>{ props.title } - Pixel share!</title>
        </Head>
        <main className={ className } style={ props.style }>
            { props.children }
        </main>
    </>;
};

export default Page;