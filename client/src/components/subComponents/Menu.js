import { useState } from 'react'
import Rebuy from './Rebuy'

export const Menu = (props) => {
    const [buyCash, setBuyCash] = useState(props.rebuy ? true : false)
    return (
        <>
            {buyCash ?
                <Rebuy buyCash={props.buyCash} setToggleModal={props.setToggleModal} setBuyCash={setBuyCash} />
                : <>
                    <div className="menuRow" onClick={() => {
                        props.onfuncion()
                    }
                    }> Stand up</div>
                    <div className="menuRow" onClick={() => setBuyCash(true)}> Buy more</div>
                </>
            }
        </>

    )
}