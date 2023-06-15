import { SetStateAction } from "react";
import { Chip } from 'primereact/chip';
import { Dialog } from 'primereact/dialog';

export default function CheckInCode(props: {
    visible: boolean,
    setVisible: (value: SetStateAction<boolean>) => void
}) {
    

    return (
        <Dialog header="入场码" visible={props.visible} style={{ width: '75vw' }} onHide={() => props.setVisible(false)}>
            <p className="m-0 leading-loose">
                入场码是工会或者委员会通过内部邮件发送给你的一个与您的<em className='underline decoration-4'>STAFF ID</em>绑定的一串字符。
            <br/>
            以下使用场景将会使你的邀请码立刻失效，并无法参加抽奖</p>
            <hr />
            <ul>
                <li><Chip label="1"/>冒用他人邀请码</li>
                <li><Chip label="2"/>转送他人邀请码</li>
            </ul>
        </Dialog>
    )

}