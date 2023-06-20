'use client'
import { Image } from 'primereact/image';

export default function ImageComponent(prop:{
    url: string,
    alt: string
}){

    return <>
    <h1>{prop.alt}</h1>
    <Image src={prop.url} alt={prop.alt} preview/>
    <p>点击图片放大显示</p>
    </>

}